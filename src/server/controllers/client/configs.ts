import { Request, Response } from "express";
import STATUS_CODES from "../../../types/StatusCodes";
import DiscordClient from "../../client/classes/client";
import getConfig from "../../client/utils/constants/getConfig";

export default (client: DiscordClient) => {
  return async function getConfigAPI(req: Request, res: Response) {
    //@ts-ignore
    if (!req.user) return res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    //@ts-ignore
    const data = await getConfig(client, req.params.id);
    return res.send(data);
  };
};
