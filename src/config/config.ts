import * as dotenv from 'dotenv';

import app from '../../package.json';

dotenv.config();

const isTestEnvironment = process.env.NODE_ENV === 'test';

export default {
  name: app.name,
  version: app.version,
  environment: process.env.NODE_ENV || 'development',
  host: process.env.APP_HOST || '127.0.0.1',
  port: (isTestEnvironment ? process.env.TEST_APP_PORT : process.env.APP_PORT) || '8000',
  pagination: {
    page: 1,
    maxRows: 20
  },
  spanner: {
    projectId: process.env.SPANNER_PROJECT_ID || '',
    instanceId: process.env.SPANNER_INSTANCE_ID || '',
    databaseId: process.env.SPANNER_DATABASE_ID || ''
  },
  auth: {
    saltRounds: process.env.SALT_ROUNDS || 11,
    accessTokenDuration: process.env.ACCESS_TOKEN_DURATION || '10m',
    refreshTokenDuration: process.env.REFRESH_TOKEN_DURATION || '24h',
    accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY || '<ACCESS_TOKEN_SECRET_KEY>',
    refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY || '<REFRESH_TOKEN_SECRET_KEY>'
  },
  logging: {
    dir: process.env.LOGGING_DIR || 'logs',
    level: process.env.LOGGING_LEVEL || 'debug',
    maxSize: process.env.LOGGING_MAX_SIZE || '20m',
    maxFiles: process.env.LOGGING_MAX_FILES || '7d',
    datePattern: process.env.LOGGING_DATE_PATTERN || 'YYYY-MM-DD'
  }
};
