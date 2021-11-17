import { Request, Response } from "express";
import DiscordClient from "../../../client/client";
import buildUserService from "../../services/auth/buildUser.service";
import createUser from "../../services/auth/createUser.service";
import encryptTokensService from "../../services/auth/encryptTokens.service";
import { getDiscordUserDetails } from "../../services/auth/getDiscordUserDetails.service";
import refreshTokenService from "../../services/auth/refreshToken.service";
import { serializeSession } from "../../sessions/serializeSession";
import STATUS_CODES from "../../types/StatusCodes";

export default (client: DiscordClient) => {
  return async (req: Request, res: Response) => {
    if (!req.user) return res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    try {
      const response = await refreshTokenService(req, res);
      const { data } = response;
      const { access_token, refresh_token } = data;
      const encryptedTokens = encryptTokensService(access_token, refresh_token);
      const { data: loggedUser } = await getDiscordUserDetails(access_token);
      const newUser = await createUser(
        buildUserService(loggedUser, encryptedTokens)
      );
      client.accessTokens.set(loggedUser.id, data);
      await serializeSession(req, newUser);

      res.sendStatus(STATUS_CODES.OK);
    } catch (err) {
      res.sendStatus(STATUS_CODES.BAD_REQUEST);
    }
  };
};
