import { GuildChannel, Message } from "discord.js";
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
			name: "enable-auto-translate",
			category: "utility",
			aliases: [],
			userPermissions: ["MANAGE_GUILD"],
			botPermissions: [],
			tutorialGif: "",
		});
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (!message.guild || !message.member) return;
		client.autoTranslate.set(message.channel.id, true);
		message.reply("done");
	}
}
