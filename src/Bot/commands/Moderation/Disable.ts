import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import { GuildConfig } from "../../utils/MongoDB/Models";
import configType from "../../utils/types/GuildConfig";

export default class Command extends BaseCommand {
	constructor() {
		super({
			name: "disable",
			category: "moderation",
			aliases: [],
			userPermissions: ["MANAGE_GUILD"],
			botPermissions: ["MANAGE_GUILD"],
			tutorialGif: "",
		});
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (!message.guild || !message.member) return;

		const config = await getConfig(client, message.guild.id);

		const { language } = config;
		let disabledCommands = config?.disabledCommands;
		if (!disabledCommands) disabledCommands = {};
		const command =
			client.commands.get(args[0]) ||
			client.commands.get(client.aliases.get(args[0]) as string);
		if (!command) {
			const relatedCommand =
				client.commands.find((command) =>
					command.getName().includes(args.join(" ").toLowerCase()),
				) ||
				client.commands.find((command) =>
					args.join(" ").toLowerCase().includes(command.getName()),
				) ||
				client.commands.get(
					client.aliases.find((command) =>
						command.toLowerCase().includes(args.join(" ").toLowerCase()),
					) as string,
				) ||
				client.commands.get(
					client.aliases.find((command) =>
						args.join(" ").toLowerCase().includes(command.toLowerCase()),
					) as string,
				);
			if (relatedCommand) {
				message.reply({
					content: GetLanguage(
						"CommandNotFoundButFoundRelatedCommand",
						config.language,
					).replaceAll("{command}", relatedCommand.getName()),
				});
			} else {
				message.reply({
					content: GetLanguage("CommandNotFound", config.language),
				});
			}
			return;
		}

		if (command.getName() === "disable" || command.getName() === "enable") {
			message.reply({
				content: GetLanguage("CommandCannotBeDisabled", language),
			});
			return;
		}
		if (disabledCommands[command.getName()] === true) {
			message.reply({
				content: GetLanguage("CommandIsAlreadyDisabled", language),
			});
			return;
		}
		disabledCommands[command.getName()] = true;
		const DatabaseConfig: any = await GuildConfig.findOneAndUpdate(
			{ guildId: message.guild.id, clientId: client.user?.id },
			{ disabledCommands },
			{ new: true },
		);
		if (DatabaseConfig) {
			client.configs.set(message.guild.id, DatabaseConfig as configType);
			await message.reply(
				GetLanguage("CommandHasBeenDisabled", language).replaceAll(
					"{command}",
					command.getName(),
				),
			);
		}
	}
}
