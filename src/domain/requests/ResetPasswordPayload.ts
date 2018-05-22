/**
 * ResetPasswordPayload Interface.
 */
interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
}

export default ResetPasswordPayload;
