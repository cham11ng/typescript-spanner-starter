import Scope from '../enums/Scope';

/**
 * Map route based scopes.
 */
const routeToScopeMap: any = {
  '/users': {
    GET: Scope.LIST_USER,
    POST: Scope.ADD_USER
  }
};

export default routeToScopeMap;
