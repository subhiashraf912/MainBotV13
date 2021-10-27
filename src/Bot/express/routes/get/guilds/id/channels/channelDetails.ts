import DiscordClient from "../../../../../../client/client";
import { Express, Request, Response } from "express";
import BaseGet from "../../../../../classes/bases/BaseGet";
const GetGuilds = async (app: Express, client: DiscordClient) => {
	const route = "/guilds/:id/channels/:channelId/name";
	const callBack = (Request: Request, Response: Response) => {
		const channel = client.guilds.cache
			.get(Request.params.id)
			?.channels.cache.get(Request.params.channelId);
		Response.send(
			channel?.name || {
				error: "Channel wasn't found.",
			},
		);
		return {};
	};
	return new BaseGet({ app, route, callBack });
};

export default GetGuilds;
