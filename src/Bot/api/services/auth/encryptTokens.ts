import { encrypt } from "../../helpers/Encrypt";
import EncryptedTokens from "../../types/EncryptedTokens";

export default (accessToken: string, refreshToken: string): EncryptedTokens => {
  const encryptedAccessToken = encrypt(accessToken);
  const encryptedRefreshToken = encrypt(refreshToken);
  return {
    accessToken: encryptedAccessToken,
    refreshToken: encryptedRefreshToken,
  };
};
