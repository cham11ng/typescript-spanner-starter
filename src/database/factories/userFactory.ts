import faker from 'faker';

import * as userService from '../../services/user';
import UserDetail from '../../domain/entities/UserDetail';

/**
 * Returns user fake data.
 *
 * @returns {Promise<UserDetail>}
 */
export function run(): Promise<UserDetail> {
  return userService.insert({
    password: 'secret',
    name: faker.name.findName(),
    email: faker.internet.email()
  });
}
