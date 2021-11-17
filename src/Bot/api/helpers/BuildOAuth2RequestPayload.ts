import url from "url";
import { OAuth2ExchangeRequestParams } from "../types/OAuthTokenExchangeParams";

export const buildOAuth2RequestPayload = (data: OAuth2ExchangeRequestParams) =>
  new url.URLSearchParams(data).toString();
