import DiscordClient from "../../../../client/client";
import { Express, Request, Response } from "express";
import BaseGet from "../../../classes/bases/BaseGet";
const GetGuilds = async (app: Express, client: DiscordClient) => {
	const route = "/music/:guild";
	const callBack = (Request: Request, Response: Response) => {
		Response.send(client.distube.getQueue(Request.params.guild)?.songs);
		return {};
	};
	return new BaseGet({ app, route, callBack });
};

export default GetGuilds;
