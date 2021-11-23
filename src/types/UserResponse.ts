type UserResponse = {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: string | null;
  banner_color: string | null;
  accent_color: string | null;
  locale: string;
  mfa_enabled: boolean;
  premium_type: number;
  email: string;
  verified: boolean;
};
export default UserResponse;
