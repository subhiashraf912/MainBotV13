import DiscordClient from "../../../../client/client";
import { Express, Request, Response } from "express";
import BaseGet from "../../../classes/bases/BaseGet";
import getConfig from "../../../../utils/constants/getConfig";
import { VoiceChannel } from "discord.js/typings/index.js";
const GetGuilds = async (app: Express, client: DiscordClient) => {
	const route = "/music/play/:guild/:channel/:song";
	const callBack = async (Request: Request, Response: Response) => {
		const { guild, channel, song } = Request.params;
		if (!guild || !client.guilds.cache.get(guild)) {
			Response.status(400).send({ message: "Guild is required" });
			return {};
		}
		if (
			!channel ||
			!client.guilds.cache.get(guild)?.channels.cache.get(channel)
		) {
			Response.status(400).send({ message: "Channel is required" });
			return {};
		}
		if (!song) {
			Response.status(400).send({ message: "Song is required" });
			return {};
		}
		const channelObj = client.channels.cache.get(channel);
		if (!(channelObj instanceof VoiceChannel)) {
			Response.status(400).send({
				message: "Channel should be a voice channel",
			});
			return {};
		}
		try {
			await client.distube.playVoiceChannel(channelObj, song);
			Response.status(200).send(
				(await getConfig(client, Request.params.id)).prefix,
			);
		} catch (err: any) {
			Response.status(400).send({ error: err.message });
		}
		return {};
	};
	return new BaseGet({ app, route, callBack });
};

export default GetGuilds;
