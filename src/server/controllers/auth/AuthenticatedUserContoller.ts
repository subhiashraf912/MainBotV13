import { Request, Response } from "express";
import DiscordClient from "../../client/classes/client";

export default (client: DiscordClient) => {
  return function getAuthenticatedUserController(req: Request, res: Response) {
    //@ts-ignore
    res.send(req.user);
  };
};
