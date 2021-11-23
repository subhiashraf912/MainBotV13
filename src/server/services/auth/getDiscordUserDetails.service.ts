import axios from "axios";
import { authHeaders } from "../../helpers/AuthHeaders";
import { DISCORD_API_ROUTES } from "../../../types/DiscordAPIRoutes";
import OAuth2UserResponse from "../../../types/OAuth2UserResponse";
export async function getDiscordUserDetails(accessToken: string) {
  return axios.get<OAuth2UserResponse>(
    DISCORD_API_ROUTES.OAUTH2_USER,
    authHeaders(accessToken)
  );
}
