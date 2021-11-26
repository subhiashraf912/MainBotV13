import { Request, Response } from "express";
import DiscordClient from "../../client/classes/client";
import getConfig from "../../client/utils/constants/getConfig";

export default (client: DiscordClient) => {
  return async function getConfigAPI(req: Request, res: Response) {
    //@ts-ignore
    const data = await getConfig(client, req.params.id);
    return res.send(data);
  };
};
