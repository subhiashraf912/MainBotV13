import { Request, Response } from "express";
import DiscordClient from "../../client/classes/client";

export default (client: DiscordClient) => {
  return async function getClientCommands(req: Request, res: Response) {
    //@ts-ignore
    const data = client.commands;
    return res.send(data);
  };
};
