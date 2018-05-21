import logger from '../src/utils/logger';
import spanner from '../src/config/spanner';

const USERS = `DROP TABLE users`;
const USER_ROLES = `DROP TABLE user_roles`;
const USER_SESSIONS = `DROP TABLE user_sessions`;

(async () => {
  const request = [USER_SESSIONS, USERS, USER_ROLES];
  try {
    const [operation] = await spanner.updateSchema(request);

    logger.debug('Droping tables ...');
    logger.debug('Waiting for operation to complete ...');

    await operation.promise();

    logger.debug('Tables dropped.');
  } catch (err) {
    logger.error('ERROR:', JSON.stringify({ message: err.message, detail: err.details }, null, 2));
  }
})();
