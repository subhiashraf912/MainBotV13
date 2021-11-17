import axios from "axios";
import { Request, Response } from "express";
import DiscordClient from "../../../client/client";
import { authHeaders } from "../../helpers/AuthHeaders";
import { decrypt } from "../../helpers/Decrypt";
import { DISCORD_API_ROUTES } from "../../types/DiscordAPIRoutes";
import STATUS_CODES from "../../types/StatusCodes";
export default (client: DiscordClient) => {
  return async (req: Request, res: Response) => {
    try {
      if (!req.user) return res.sendStatus(STATUS_CODES.BAD_REQUEST);
      const decryptedAccessToken = decrypt(req.user.accessToken);
      const { data: guilds } = await axios.get(
        DISCORD_API_ROUTES.OAUTH2_USER_GUILDS,
        authHeaders(decryptedAccessToken)
      );
      res.send(guilds);
    } catch (err) {
      res.sendStatus(STATUS_CODES.BAD_REQUEST);
      
    }
  };
};
