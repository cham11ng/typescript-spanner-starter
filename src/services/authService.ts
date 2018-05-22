import lang from '../config/lang';
import * as jwt from '../utils/jwt';
import logger from '../utils/logger';
import * as uuid from '../utils/uuid';
import spanner from '../config/spanner';
import * as bcrypt from '../utils/bcrypt';
import Table from '../resources/enums/Table';
import JWTPayload from '../domain/misc/JWTPayload';
import SessionInfo from '../domain/misc/SessionInfo';
import NotFoundError from '../exceptions/NotFoundError';
import ForbiddenError from '../exceptions/ForbiddenError';
import LoginPayload from '../domain/requests/LoginPayload';
import * as sessionService from '../services/sessionService';
import roleToScopeMap from '../resources/maps/roleToScopeMap';
import UnauthorizedError from '../exceptions/UnauthorizedError';
import ResetPasswordPayload from '../domain/requests/ResetPasswordPayload';
import ForgotPasswordPayload from '../domain/requests/ForgotPasswordPayload';

const { errors } = lang;

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

  logger.debug('Login: Fetched user by email -', JSON.stringify(result, null, 2));

  if (result) {
    logger.debug(`Login: Comparing request password - ${password} and hashed password - ${result.password}`);

    const isSame = await bcrypt.compare(password, result.password);

    logger.debug('Login: Password match status -', isSame);

    if (isSame) {
      const { name, role_id: roleId, id: userId } = result;

      const scopes = roleToScopeMap[roleId];
      const jwtPayload = { name, email, userId, roleId };
      logger.debug('JWT: Refresh token payload -', JSON.stringify(jwtPayload, null, 2));
      const refreshToken = jwt.generateRefreshToken(jwtPayload);

      const session = await sessionService.create({ userId, token: refreshToken });

      const loggedInUser = { ...jwtPayload, scopes, sessionId: session.id };
      logger.debug('JWT: Access token payload -', JSON.stringify(loggedInUser, null, 2));
      const accessToken = jwt.generateAccessToken(loggedInUser);

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

  const scopes = roleToScopeMap[jwtPayload.roleId];
  const loggedInUser = { ...jwtPayload, scopes, sessionId: result.id };
  logger.debug('JWT: Access token payload -', JSON.stringify(loggedInUser, null, 2));

  const accessToken = jwt.generateAccessToken(loggedInUser);
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

/**
 * Generate verification token and send email in mentioned email.
 *
 * @param {SessionInfo} session
 */
export async function forgot(forgotPasswordPayload: ForgotPasswordPayload) {
  const { email } = forgotPasswordPayload;

  const [[user]] = await spanner.run({
    json: true,
    sql: 'SELECT * FROM users where email = @email limit 1',
    params: {
      email
    }
  });

  logger.debug('Forgot Password: Fetched user by email -', JSON.stringify(user, null, 2));

  if (!user) {
    throw new NotFoundError(errors.userNotFound);
  }

  const token = uuid.generateToken();
  const resetPasswordTokenInfo = {
    token,
    user_id: user.id,
    created_at: new Date()
  };

  logger.debug('Forgot Password: Inserting reset password token -', JSON.stringify(resetPasswordTokenInfo, null, 2));

  const resetPasswordTokenTable = spanner.table(Table.RESET_PASSWORD_TOKENS);
  const [result] = await resetPasswordTokenTable.insert([resetPasswordTokenInfo]);

  logger.debug('Forgot Password: Token inserted successfully -', JSON.stringify(result, null, 2));
}

/**
 * Reset password using verification.
 *
 * @param {SessionInfo} session
 */
export async function reset(forgotPasswordPayload: ResetPasswordPayload) {
  const { token, email } = forgotPasswordPayload;

  const [[forgotPasswordToken]] = await spanner.run({
    json: true,
    sql: `SELECT * FROM reset_password_tokens 
        INNER JOIN users 
        ON reset_password_tokens.user_id = users.id 
        WHERE email = @email
        AND token = @token`,
    params: {
      email,
      token
    }
  });

  logger.debug('Forgot Password: Fetched token by token and email -', JSON.stringify(forgotPasswordToken, null, 2));

  if (!forgotPasswordToken) {
    throw new NotFoundError(errors.invalidToken);
  }

  const password = await bcrypt.hash(forgotPasswordPayload.password);
  const userInfo = {
    password,
    id: forgotPasswordToken.user_id,
    role_id: forgotPasswordToken.role_id
  };

  logger.debug('Forgot Password: Updating user with new password -', JSON.stringify(userInfo, null, 2));
  const userTable = await spanner.table(Table.USERS);
  const [updateResult] = await userTable.update([userInfo]);
  logger.debug('Forgot Password: Updated user with new password -', JSON.stringify(updateResult, null, 2));

  logger.debug('Forgot Password: Deleting reset password token -', JSON.stringify(forgotPasswordToken, null, 2));
  const resetPasswordTokenTable = spanner.table(Table.RESET_PASSWORD_TOKENS);
  const [result] = await resetPasswordTokenTable.deleteRows([[token, forgotPasswordToken.user_id]]);
  logger.debug('Forgot Password: Token removed successfully -', JSON.stringify(result, null, 2));
}
