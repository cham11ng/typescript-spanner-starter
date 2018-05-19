import SpannerModel from './SpannerModel';
import Table from '../resources/enums/Table';

/**
 * User model.
 */
class User extends SpannerModel {
  public static tableName = Table.USERS;
}

export default User;
