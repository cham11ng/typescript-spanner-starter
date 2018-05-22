import Role from '../enums/Role';
import Scope from '../enums/Scope';

/**
 * Map role based scopes.
 */
const roleToScopeMap: any = {
  [Role.NORMAL_USER]: [Scope.LIST_USER],
  [Role.ADMIN]: [Scope.LIST_USER, Scope.ADD_USER]
};

export default roleToScopeMap;
