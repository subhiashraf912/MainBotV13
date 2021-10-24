import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";
import DJSVoice from "@discordjs/voice";
export default class Command extends BaseCommand {
	constructor() {
		super({
			name: "vkick",
			category: "moderation",
			aliases: [],
			userPermissions: ["MOVE_MEMBERS"],
			botPermissions: ["MOVE_MEMBERS"],
			tutorialGif: "",
		});
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (!message.guild) return;
		if (!message.member) return;
		const cachedConfig = await getConfig(client, message.guild.id);
		const { language } = cachedConfig;

		const target = await getMember({
			message,
			query: args.join(" "),
		});

		if (!target) {
			message.reply({
				content: GetLanguage("MemberNotFound", language),
			});
			return;
		}
		if (target?.voice.channel) {
			target?.voice.setChannel(null, `responsible user: ${message.author.tag}`);
			message.reply({
				content: GetLanguage(
					"MemberGotKickedFromAVoiceChannel",
					language,
				).replaceAll("{member}", target?.user.tag),
			});
		} else {
			message.reply({
				content: GetLanguage("MemberIsNotInAVoiceChannel", language),
			});
		}
	}
}
