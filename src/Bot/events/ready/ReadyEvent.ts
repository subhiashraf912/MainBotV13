import BaseEvent from "../../utils/structures/BaseEvent";
import DiscordClient from "../../client/client";
import { StageChannel, VoiceChannel } from "discord.js";

export default class ReadyEvent extends BaseEvent {
	constructor() {
		super("ready");
	}
	async run(client: DiscordClient) {
		try {
			const senGuild = client.guilds.cache.get("783991881028993045");
			if (senGuild?.me?.voice.channel) {
				const channel = senGuild.me.voice.channel;
				await client.distube.playVoiceChannel(
					channel,
					"https://www.youtube.com/channel/UCiOPAnYULQ0P97xmPDB5Zrw",
				);
				client.distube.setRepeatMode(channel, 2);
			} else {
				const channel = await senGuild?.channels.fetch("895926753166520330");
				await client.distube.playVoiceChannel(
					channel as StageChannel,
					"https://www.youtube.com/channel/UCiOPAnYULQ0P97xmPDB5Zrw",
				);
				client.distube.setRepeatMode(channel as StageChannel, 2);
			}
		} catch {}
		console.log(
			`[${client.user?.tag}] With the ID: [${client.user?.id}] Has Logged In.`,
		);
	}
}
