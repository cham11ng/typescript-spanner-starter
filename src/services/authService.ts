import * as jwt from '../utils/jwt';
import logger from '../utils/logger';
import config from '../config/config';
import spanner from '../config/spanner';
import * as bcrypt from '../utils/bcrypt';
import JWTPayload from '../domain/misc/JWTPayload';
import SessionInfo from '../domain/misc/SessionInfo';
import ForbiddenError from '../exceptions/ForbiddenError';
import LoginPayload from '../domain/requests/LoginPayload';
import * as sessionService from '../services/sessionService';
import UnauthorizedError from '../exceptions/UnauthorizedError';

const { errors } = config;

/**
 * Create user session for valid user login.
 *
 * @param {LoginPayload} loginPayload
 * @returns {object}
 */
export async function login(loginPayload: LoginPayload) {
  const { email, password } = loginPayload;

  const [[result]] = await spanner.run({
    json: true,
    sql: 'SELECT * FROM users where email = @email limit 1',
    params: {
      email
    }
  });

  logger.debug('Login: Fetched user by email - ', JSON.stringify(result, null, 2));

  if (result) {
    logger.debug(`Login: Comparing request password - ${password} and hashed password - ${result.password}`);

    const isSame = await bcrypt.compare(password, result.password);

    logger.debug('Login: Password match status -', isSame);

    if (isSame) {
      const { name, roleId, id: userId } = result;
      const loggedInUser = { name, email, userId, roleId };

      const refreshToken = jwt.generateRefreshToken(loggedInUser);

      const userSessionPayload = { userId, token: refreshToken };
      const session = await sessionService.create(userSessionPayload);

      const accessToken = jwt.generateAccessToken({ ...loggedInUser, sessionId: session.id });

      return { refreshToken, accessToken };
    }
  }

  throw new UnauthorizedError(errors.invalidCredentials);
}

/**
 * Refresh new access token.
 *
 * @param {string} token
 * @param {jwtPayload} jwtPayload
 * @returns {string}
 */
export async function refresh(token: string, jwtPayload: JWTPayload) {
  logger.debug('User Session: Fetching session of token -', token);

  const [[result]] = await spanner.run({
    json: true,
    sql: 'SELECT * FROM user_sessions where token = @token limit 1',
    params: {
      token
    }
  });

  logger.debug('User Session: fetched session -', JSON.stringify(result, null, 2));

  if (!result) {
    throw new ForbiddenError(errors.sessionNotMaintained);
  }

  const accessToken = jwt.generateAccessToken({ ...jwtPayload, sessionId: result.id });
  logger.debug('JWT: New access token generated -', accessToken);

  return { accessToken };
}

/**
 * Remove user session.
 *
 * @param {SessionInfo} session
 */
export async function logout(session: SessionInfo) {
  const result = await sessionService.remove(session);

  if (!result) {
    throw new ForbiddenError(errors.invalidToken);
  }
}
