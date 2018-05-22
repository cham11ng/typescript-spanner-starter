import logger from '../src/utils/logger';
import spanner from '../src/config/spanner';

const USER_ROLES = `
  CREATE TABLE user_roles (
    id STRING(MAX) NOT NULL,
    name STRING(MAX) NOT NULL,
    description STRING(MAX)
  ) PRIMARY KEY (id)`;

const USERS = `
  CREATE TABLE users (
    id STRING(MAX) NOT NULL,
    name STRING(MAX) NOT NULL,
    email STRING(MAX) NOT NULL,
    password STRING(MAX) NOT NULL,
    role_id STRING(MAX) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
  ) PRIMARY KEY (id, role_id)`;

const USER_SESSIONS = `
  CREATE TABLE user_sessions (
    id STRING(MAX) NOT NULL,
    token STRING(MAX) NOT NULL,
    user_id STRING(MAX) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
  ) PRIMARY KEY (token, user_id)`;

const RESET_PASSWORD_TOKENS = `
  CREATE TABLE reset_password_tokens (
    token STRING(MAX) NOT NULL,
    user_id STRING(MAX) NOT NULL,
    created_at TIMESTAMP NOT NULL
  ) PRIMARY KEY (token, user_id)`;

(async () => {
  const request = [USER_ROLES, USERS, USER_SESSIONS, RESET_PASSWORD_TOKENS];

  try {
    const [operation] = await spanner.updateSchema(request);

    logger.info('Updating Schema: Waiting for operation to complete.');
    logger.info('Do not close [x]');

    await operation.promise();

    logger.info('Schema updated.');
  } catch (err) {
    logger.error('ERROR:', JSON.stringify({ message: err.message, detail: err.details }, null, 2));
  }
})();
