import DiscordClient from "../../../../../../client/client";
import { Express, Request, Response } from "express";
import BaseGet from "../../../../../classes/bases/BaseGet";
const GetGuilds = async (app: Express, client: DiscordClient) => {
	const route = "/guilds/:id/channels";
	const callBack = (Request: Request, Response: Response) => {
		Response.send(
			client.guilds.cache.get(Request.params.id)?.channels.cache || {
				error: "Server is not cached.",
			},
		);
		return {};
	};
	return new BaseGet({ app, route, callBack });
};

export default GetGuilds;
