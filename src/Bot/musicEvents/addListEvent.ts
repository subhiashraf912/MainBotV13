import { Queue, Playlist } from "distube";
import DiscordClient from "../client/client";
import getConfig from "../utils/constants/getConfig";
import GetLanguage from "../utils/Languages";
import DisTubeBaseEvent from "../utils/structures/DistubeBaseEvent";
export default class AddListEvent extends DisTubeBaseEvent {
	constructor() {
		super("addList");
	}
	async run(client: DiscordClient, queue: Queue, playlist: Playlist) {
		const config = await getConfig(
			client,
			queue.textChannel?.guildId as string,
		);

		if (queue.textChannel)
			queue.textChannel.send({
				content: GetLanguage("DistubeAddListEvent", config.language)
					.replaceAll("{playlistName}", playlist.name)
					.replaceAll("{playlistLength}", playlist.songs.length.toString()),
			});
	}
}
