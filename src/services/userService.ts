import logger from '../utils/logger';
import spanner from '../config/spanner';
import * as bcrypt from '../utils/bcrypt';
import Role from '../resources/enums/Role';
import { camelize } from '../utils/object';
import Table from '../resources/enums/Table';
import UserDetail from '../domain/entities/UserDetail';
import UserPayload from '../domain/requests/UserPayload';

/**
 * Fetch all users from users table.
 *
 * @returns {Promise<UserDetail[]>}
 */
export async function fetchAll(): Promise<UserDetail[]> {
  logger.debug('Fetching users from database:');

  const userTable = await spanner.table(Table.USERS);
  const [users] = await userTable.read({
    json: true,
    keySet: { all: true },
    columns: ['id', 'role_id', 'name', 'email']
  });

  logger.debug('Fetched all users successfully:', JSON.stringify(users, null, 2));

  return camelize(users);
}

/**
 * Insert user from given user payload
 *
 * @param {UserPayload} params
 * @returns {Promise<UserDetail>}
 */
export async function insert(params: UserPayload): Promise<UserDetail> {
  logger.debug('Inserting user into database:', JSON.stringify(params, null, 2));

  const password = await bcrypt.hash(params.password);

  const userInfo = {
    ...params,
    password,
    id: 1,
    role_id: Role.NORMAL_USER,
    created_at: new Date(),
    updated_at: new Date()
  };

  const userTable = await spanner.table(Table.USERS);
  const [result] = await userTable.insert([userInfo]);

  logger.debug('User insert response:', JSON.stringify(result, null, 2));
  logger.debug('Inserted user successfully:', JSON.stringify(userInfo, null, 2));

  return camelize(userInfo);
}
