import logger from '../utils/logger';
import config from '../config/config';
import { instance } from '../config/spanner';

const { databaseId, instanceId } = config.spanner;

const USER_ROLES = `
  CREATE TABLE user_roles (
    id INT64 NOT NULL,
    name STRING(50) NOT NULL,
    description STRING(100),
  ) PRIMARY KEY (id),
`;

const USERS = `
  CREATE TABLE users (
    id INT64 NOT NULL,
    name STRING(MAX) NOT NULL,
    email STRING(MAX) NOT NULL,
    password STRING(MAX) NOT NULL,
    role_id INT64 NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) PRIMARY KEY (id, role_id)
  INTERLEAVE IN PARENT user_roles;
`;

const USER_SESSIONS = `
  CREATE TABLE public.user_sessions (
    id INT64 NOT NULL,
    token STRING(MAX) NOT NULL,
    user_id INT64 NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) PRIMARY KEY (id, user_id)
  INTERLEAVE IN PARENT users;
`;

const request = {
  schema: {
    USER_ROLES,
    USERS,
    USER_SESSIONS
  }
};

// Creates a database
instance
  .createDatabase(databaseId, request)
  .then((results: any) => {
    const database = results[0];
    const operation = results[1];

    logger.debug(`Waiting for operation on ${database.id} to complete...`);

    return operation.promise();
  })
  .then(() => {
    logger.debug(`Created database ${databaseId} on instance ${instanceId}.`);
  })
  .catch((err: any) => {
    logger.debug('ERROR:', err);
  });
