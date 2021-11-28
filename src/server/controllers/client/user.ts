import { Request, Response } from "express";
import STATUS_CODES from "../../../types/StatusCodes";
import DiscordClient from "../../client/classes/client";

export default (client: DiscordClient) => {
  return async function getClientUser(req: Request, res: Response) {
    //@ts-ignore
    if (!req.user) return res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    //@ts-ignore
    const data = client.user;
    return res.send(data);
  };
};
