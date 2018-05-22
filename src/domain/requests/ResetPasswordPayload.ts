/**
 * ResetPasswordPayload Interface.
 */
interface ResetPasswordPayload {
  token: string;
  email: string;
  oldPassword: string;
  newPassword: string;
}

export default ResetPasswordPayload;
