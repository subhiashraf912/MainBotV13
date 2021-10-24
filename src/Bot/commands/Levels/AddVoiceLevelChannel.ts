import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getChannel from "../../utils/constants/getChannel";
import { GuildConfig } from "../../utils/MongoDB/Models";
import configType from "../../utils/types/GuildConfig";

export default class Command extends BaseCommand {
	constructor() {
		super({
			name: "add-voice-level-channel",
			category: "levels",
			aliases: [],
			userPermissions: ["MANAGE_GUILD"],
			botPermissions: [],
			tutorialGif: "",
		});
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		const cachedConfig = await getConfig(client, message.guild?.id as string);

		const language = cachedConfig.language;
		let voiceLevelsChannels = cachedConfig.voiceLevelsChannels;
		if (!voiceLevelsChannels) voiceLevelsChannels = [];

		if (!args[0]) {
			message.reply({
				content: GetLanguage("ChannelMentionIsRequired", language),
			});
			return;
		}
		const channel = getChannel({ message, query: args.join(" ") });

		if (!channel) {
			message.reply({
				content: GetLanguage("ChannelNotFound", language),
			});
			return;
		}

		if (channel.type !== "GUILD_VOICE") {
			message.reply({
				content: GetLanguage("VoiceChannelIsRequired", language),
			});
			return;
		}
		if (voiceLevelsChannels.includes(channel.id)) {
			message.reply({
				content: GetLanguage("ChannelAlreadyInTheLevelsList", language),
			});
			return;
		}
		voiceLevelsChannels.push(channel.id);

		const config = await GuildConfig.findOneAndUpdate(
			{
				guildId: message.guild?.id as string,
				clientId: client.user?.id,
			},
			{
				voiceLevelsChannels,
			},
			{ new: true },
		);

		client.configs.set(message.guild?.id as string, config as configType);
		message.reply({
			content: GetLanguage("AddedLevelChannel", language).replaceAll(
				"{channel}",
				channel.toString(),
			),
		});
	}
}
