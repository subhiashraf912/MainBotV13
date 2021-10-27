import DiscordClient from "../../../../../client/client";
import { Express, Request, Response } from "express";
import BaseGet from "../../../../classes/bases/BaseGet";
import getConfig from "../../../../../utils/constants/getConfig";
const GetGuilds = async (app: Express, client: DiscordClient) => {
  const route = "/configs/:id/botjoinroles";
  const callBack = async (Request: Request, Response: Response) => {
    Response.send((await getConfig(client, Request.params.id)).botJoinRoles);
    return {};
  };
  return new BaseGet({ app, route, callBack });
};

export default GetGuilds;
