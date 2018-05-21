import logger from '../src/utils/logger';
import spanner from '../src/config/spanner';
import Table from '../src/resources/enums/Table';

(async () => {
  const userRoleTable = await spanner.table(Table.USER_ROLES);

  logger.info('Inserting user roles.');
  logger.info('Do not close [x]');

  try {
    const roles = [
      { id: 1, name: 'Admin', description: 'This is super admin.' },
      { id: 2, name: 'Normal User', description: 'This is normal user.' }
    ];

    logger.debug('Inserting roles -', JSON.stringify(roles, null, 2));

    const [result] = await userRoleTable.upsert(roles); // Insert and update table

    logger.debug('User role inserted successfully -', JSON.stringify(result, null, 2));
  } catch (err) {
    logger.error('ERROR:', err.message);
  }
})();
