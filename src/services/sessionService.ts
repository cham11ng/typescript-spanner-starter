import logger from '../utils/logger';
import * as uuid from '../utils/uuid';
import spanner from '../config/spanner';
import * as object from '../utils/object';
import Table from '../resources/enums/Table';
import SessionInfo from '../domain/misc/SessionInfo';
import UserSessionDetail from '../domain/entities/UserSessionDetail';
import UserSessionPayload from '../domain/requests/UserSessionPayload';

/**
 * Insert user from given user payload.
 *
 * @param {UserSessionPayload} params
 * @returns {Promise<UserSessionDetail>}
 */
export async function create(params: UserSessionPayload): Promise<UserSessionDetail> {
  logger.debug('User Session: Creating session - ', JSON.stringify(params, null, 2));

  const userSessionInfo = {
    id: uuid.generate(),
    token: params.token,
    user_id: params.userId,
    created_at: new Date(),
    updated_at: new Date()
  };

  const userSessionTable = await spanner.table(Table.USER_SESSIONS);
  const [result] = await userSessionTable.insert([userSessionInfo]);

  logger.debug('User Session: Session created successfully - ', JSON.stringify(result, null, 2));

  return object.camelize(userSessionInfo);
}

/**
 * Deactivate user session.
 *
 * @param {SessionInfo} session
 * @returns {Promise<UserSessionDetail>}
 */
export async function remove(session: SessionInfo): Promise<any> {
  logger.debug('User Session: Destroying session -', JSON.stringify(session, null, 2));

  const userSessionTable = spanner.table(Table.USER_SESSIONS);
  const [result] = await userSessionTable.deleteRows([[session.token, session.userId]]);

  logger.debug('User Session: Session destroyed -', JSON.stringify(result, null, 2));

  return object.camelize(result);
}
