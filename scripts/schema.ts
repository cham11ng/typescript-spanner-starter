import logger from '../src/utils/logger';
import spanner from '../src/config/spanner';

const USER_ROLES = `
  CREATE TABLE user_roles (
    id INT64 NOT NULL,
    name STRING(50) NOT NULL,
    description STRING(100),
  ) PRIMARY KEY (id)`;

const USERS = `
  CREATE TABLE users (
    id INT64 NOT NULL,
    name STRING(MAX) NOT NULL,
    email STRING(MAX) NOT NULL,
    password STRING(MAX) NOT NULL,
    role_id INT64 NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
  ) PRIMARY KEY (id, role_id)`;

const USER_SESSIONS = `
  CREATE TABLE user_sessions (
    id INT64 NOT NULL,
    token STRING(MAX) NOT NULL,
    user_id INT64 NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
  ) PRIMARY KEY (token, user_id)`;

(async () => {
  const request = [USER_ROLES, USERS, USER_SESSIONS];
  try {
    const [operation] = await spanner.updateSchema(request);

    logger.debug('Updating schema ...');
    logger.debug('Waiting for operation to complete ...');

    await operation.promise();

    logger.debug('Schema updated.');
  } catch (err) {
    logger.error('ERROR:', JSON.stringify({ message: err.message, detail: err.details }, null, 2));
  }
})();
