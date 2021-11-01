/** @format */

import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getChannel from "../../utils/constants/getChannel";

export default class Command extends BaseCommand {
	constructor() {
		super({
			name: "hide",
			category: "moderation",
			aliases: [],
			userPermissions: ["MANAGE_CHANNELS", "MANAGE_ROLES"],
			botPermissions: ["MANAGE_CHANNELS", "MANAGE_ROLES"],
			tutorialGif: "",
		});
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (!message.guild || !message.member) return;
		const config = await getConfig(client, message.guild.id);
		const language = config.language;
		const channel = getChannel({
			message,
			query: args.join(" "),
			returnMessageChannel: true,
		});

		const role = message.guild.roles.cache.find((r) => r.name === "@everyone");
		if (!channel || !role) return;
		if (!channel.manageable) {
			message.reply({
				content: GetLanguage("ChannelIsNotManageable", language),
			});
			return;
		}

		channel.permissionOverwrites
			.edit(role, {
				VIEW_CHANNEL: false,
			})
			.then(async () => {
				await message.react("☑");
				return;
			})
			.catch(async (err) => {
				await message.reply({
					content: err.message,
				});
				return;
			});
	}
}
