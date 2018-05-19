import SpannerModel from './SpannerModel';
import Table from '../resources/enums/Table';

/**
 * UserSession model.
 */
class UserSession extends SpannerModel {
  public static tableName = Table.USER_SESSIONS;
}

export default UserSession;
