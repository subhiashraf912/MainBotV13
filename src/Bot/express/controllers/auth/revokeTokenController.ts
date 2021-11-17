import { Request, Response } from "express";
import DiscordClient from "../../../client/client";
import revokeTokenService from "../../services/auth/revokeToken.service";
import STATUS_CODES from "../../types/StatusCodes";

export default(client: DiscordClient)=> {
  return async (req: Request, res: Response) => {
    if (!req.user) return res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    try {
      await revokeTokenService(req);
      res.sendStatus(STATUS_CODES.OK);
    } catch (err) {
      res.sendStatus(STATUS_CODES.BAD_REQUEST);
    }
  }
}