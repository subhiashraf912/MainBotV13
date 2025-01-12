import { Request, Response } from "express";
import STATUS_CODES from "../../../types/StatusCodes";
import DiscordClient from "../../client/classes/client";

export default (client: DiscordClient) => {
  return async function getClientUser(req: Request, res: Response) {
    //@ts-ignore
    const data = client.user;
    return res.send(data);
  };
};
