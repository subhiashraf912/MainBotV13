import axios from "axios";
import DiscordOAuth2CredentialsResponse from "../../../utils/types/DiscordOAuth2CredentialsResponse";
import { axiosConfig } from "../../constants/AxiosConfig";
import { buildOAuth2RequestPayload } from "../../helpers/BuildOAuth2RequestPayload";
import { DISCORD_API_ROUTES } from "../../types/DiscordAPIRoutes";
import { OAuth2ExchangeRequestParams } from "../../types/OAuthTokenExchangeParams";
export async function exchangeAcessCodeForCredentials(
  data: OAuth2ExchangeRequestParams
) {
  const payload = buildOAuth2RequestPayload(data);
  return axios.post<DiscordOAuth2CredentialsResponse>(
    DISCORD_API_ROUTES.OAUTH2_TOKEN,
    payload,
    axiosConfig
  );
}
