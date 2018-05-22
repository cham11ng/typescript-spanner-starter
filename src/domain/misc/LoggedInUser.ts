import JWTPayload from './JWTPayload';

/**
 * LoggedInUser Interface.
 */
interface LoggedInUser extends JWTPayload {
  sessionId: number;
  scopes: null | string[];
}

export default LoggedInUser;
