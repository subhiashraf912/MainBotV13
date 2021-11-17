import DiscordClient from "../../../client/client";
import buildUserService from "../../services/auth/buildUser.service";
import createUser from "../../services/auth/createUser.service";
import encryptTokensService from "../../services/auth/encryptTokens.service";
import { exchangeAcessCodeForCredentials } from "../../services/auth/exchangeAcessCodeForCredentials.service";
import { getDiscordUserDetails } from "../../services/auth/getDiscordUserDetails.service";
import { serializeSession } from "../../sessions/serializeSession";
import { Request, Response } from "express";
import STATUS_CODES from "../../types/StatusCodes";

export default (client: DiscordClient) => {
  return async (req: Request, res: Response) => {
    const { code } = req.query;
    if (code) {
      try {
        const host = req.get('host')!;
        const redirect_uri = `${host.includes('localhost') ? "http" : "https"}://${req.get(
          "host"
        )}/api/auth/discord/redirect`;
        const response = await exchangeAcessCodeForCredentials({
          client_id: process.env.DISCORD_CLIENT_ID!,
          client_secret: process.env.DISCORD_CLIENT_SECRET!,
          grant_type: "authorization_code",
          code: code.toString(),
          redirect_uri,
        });
        const data = response.data;
        const { access_token, refresh_token } = data;
        const encryptedTokens = encryptTokensService(
          access_token,
          refresh_token
        );
        const { data: loggedUser } = await getDiscordUserDetails(access_token);
        const newUser = await createUser(
          buildUserService(loggedUser, encryptedTokens)
        );
        client.accessTokens.set(loggedUser.id, data);
        await serializeSession(req, newUser);
        res.sendStatus(STATUS_CODES.OK);
      } catch (err) {
        res.send(err);
        // res.sendStatus(STATUS_CODES.BAD_REQUEST);
      }
    }
  };
};
