import DiscordClient from "../../../../client/client";
import { Express, Request, Response } from "express";
import BaseGet from "../../../classes/bases/BaseGet";
const GetGuilds = async (app: Express, client: DiscordClient) => {
  const route = "/guilds";
  const callBack = (Request: Request, Response: Response) => {
    Response.send(client.guilds.cache);
    return {};
  };
  return new BaseGet({ app, route, callBack });
};

export default GetGuilds;
