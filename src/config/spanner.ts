import config from './config';
import Spanner from '@google-cloud/spanner';

const {
  spanner: { projectId, instanceId, databaseId }
} = config;

// Creates a client
const client = Spanner({ projectId });

// Gets a reference to a Cloud Spanner instance and database
export const instance = client.instance(instanceId);

const spanner = instance.database(databaseId);

export default spanner;
