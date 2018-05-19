import SpannerModel from './SpannerModel';
import Table from '../resources/enums/Table';

/**
 * UserRole model.
 */
class UserRole extends SpannerModel {
  public static tableName = Table.USER_ROLES;
}

export default UserRole;
