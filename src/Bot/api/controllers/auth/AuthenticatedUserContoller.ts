import { Request, Response } from "express";
import DiscordClient from "../../../client/client";

export default (client: DiscordClient) => {
  return function getAuthenticatedUserController(req: Request, res: Response) {
    res.send(req.user);
  };
};
