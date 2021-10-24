import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import GetLanguage from "../../utils/Languages";
import getConfig from "../../utils/constants/getConfig";

export default class ResumeCommand extends BaseCommand {
	constructor() {
		super({
			name: "resume",
			category: "music",
			aliases: ["re"],
			tutorialGif: "",
		});
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		const config = await getConfig(client, message.guild?.id as string);
		if (!message.member?.voice.channel) {
			message.reply({
				content: GetLanguage("MemberNeedsToBeInAVoiceChannel", config.language),
			});
			return;
		}

		if (
			message.guild?.me?.voice.channel &&
			message.member.voice.channel.id !== message.guild.me.voice.channel.id
		) {
			message.reply({
				content: GetLanguage(
					"MemberNeedsToBeInTheSameVoiceChannelAsTheBot",
					config.language,
				),
			});
			return;
		}
		const queue = client.distube.getQueue(message);
		if (!queue) {
			message.reply({
				content: GetLanguage("NoQueue", config.language),
			});
			return;
		}
		if (!client.distube.getQueue(message.guild?.id as string)?.paused) {
			message.reply({
				content: GetLanguage("SongIsNotPaused", config.language),
			});
			return;
		}
		client.distube.resume(message);
		message.channel.send({
			content: GetLanguage("QueueGotResumed", config.language).replaceAll(
				"{member}",
				message.author.toString(),
			),
		});
	}
}
