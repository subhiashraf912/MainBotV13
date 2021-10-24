import DiscordClient from "../../../../client/client";
import { Express, Request, Response } from "express";
import BaseGet from "../../../classes/bases/BaseGet";
import { Song } from "distube";
const GetGuilds = async (app: Express, client: DiscordClient) => {
	const route = "/musicQueue/:guild";
	const callBack = async (Request: Request, Response: Response) => {
		const songs = client.distube.getQueue(Request.params.guild)?.songs;
		if (!songs) {
			Response.status(404).send({ error: "No Songs in the queue." });
			return {};
		}
		for (const song of songs as Song[]) {
			await song.user?.fetch();
		}
		Response.send(songs);
		return {};
	};
	return new BaseGet({ app, route, callBack });
};

export default GetGuilds;
