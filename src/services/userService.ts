import logger from '../utils/logger';
import spanner from '../config/spanner';
import UserDetail from '../domain/entities/UserDetail';
/**
 * Fetch all users from users table.
 *
 * @returns {Promise<UserDetail[]>}
 */
export async function fetchAll(): Promise<UserDetail[]> {
  logger.debug('Fetching users from database:');

  const query = {
    sql: 'SELECT * FROM Singers'
  };
  // Queries rows from the Albums table
  const [singers] = await spanner.run(query);

  logger.debug('Fetched all users successfully:', JSON.stringify(singers, null, 2));

  return singers;
}
