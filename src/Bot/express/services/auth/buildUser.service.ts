import EncryptedTokens from "../../types/EncryptedTokens";
import User from "../../types/OAuth2UserResponse";
export default (user: User, credentials: EncryptedTokens) => {
  return {
    accessToken: credentials.accessToken,
    refreshToken: credentials.refreshToken,
    guilds: user.guilds || [],
    discordId: user.id,
  }
}
