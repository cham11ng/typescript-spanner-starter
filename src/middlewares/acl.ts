import { Request, Response, NextFunction } from 'express';

import lang from '../config/lang';
import logger from '../utils/logger';
import LoggedInUser from '../domain/misc/LoggedInUser';
import ForbiddenError from '../exceptions/ForbiddenError';
import routeToScopeMap from '../resources/maps/routeToScopeMap';

const { errors } = lang;

/**
 * A middleware to handle account control.
 *
 * @param {ACLOption} option
 */
function acl(req: Request, res: Response, next: NextFunction) {
  const authUser = res.locals.user as LoggedInUser;
  const scope = routeToScopeMap[req.path][req.method];

  logger.debug('ACL: Current route scope:', JSON.stringify(scope));
  logger.debug('ACL: Logged in user -', JSON.stringify(authUser, null, 2));

  const hasScope = authUser.scopes && scope && authUser.scopes.includes(scope);

  logger.debug('ACL: Resource access -', hasScope);

  if (hasScope) {
    return next();
  }

  next(new ForbiddenError(errors.unAuthorized));
}

export default acl;
