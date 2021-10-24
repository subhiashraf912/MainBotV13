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
			name: "restrict",
			category: "moderation",
			aliases: [],
			userPermissions: ["MANAGE_GUILD"],
			botPermissions: [],
			tutorialGif: "",
		});
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (!message.guild || !message.member) return;
		const config = await getConfig(client, message.guild.id);
		let commandRestricts = config.commandRestricts;
		if (!commandRestricts) commandRestricts = {};
		const channel = message.mentions.channels.first();
		if (!channel) {
			message.reply({
				content: GetLanguage("ChannelMentionIsRequired", config.language),
			});
			return;
		}
		let commandsObj: any = {};

		client.commands.map((command) => {
			!commandsObj[command.getCategory()] &&
				(commandsObj[command.getCategory()] = []);
			commandsObj[command.getCategory()].push(command.getName());
		});

		if (args[0] === "all") {
			client.commands.forEach((command) => {
				if (command.getCategory().toLowerCase() === "admins") return;
				if (!commandRestricts[command.getName()])
					commandRestricts[command.getName()] = [];
				if (commandRestricts[command.getName()].includes(channel.id)) return;
				commandRestricts[command.getName()].push(channel.id);
			});

			const DBConfig: any = await GuildConfig.findOneAndUpdate(
				{ guildId: message.guild.id, clientId: client.user?.id },
				{ commandRestricts },
				{ new: true },
			);
			client.configs.set(message.guild.id, DBConfig as configType);
			message.reply({
				content: GetLanguage("RestrictedAllCommandsToAChannel", config.language)
					?.replaceAll("{commandsAmount}", client.commands.size.toString())
					.replaceAll("{channel}", channel.toString()),
			}); //
		} else if (
			commandsObj[args[0].toLowerCase()] &&
			commandsObj[args[0].toLowerCase()][0]
		) {
			client.commands.forEach((command) => {
				if (!commandsObj[args[0]].includes(command.getName())) return;
				if (!commandRestricts[command.getName()])
					commandRestricts[command.getName()] = [];
				if (commandRestricts[command.getName()].includes(channel.id)) return;
				commandRestricts[command.getName()].push(channel.id);
			});

			const DBConfig: any = await GuildConfig.findOneAndUpdate(
				{ guildId: message.guild.id, clientId: client.user?.id },
				{ commandRestricts },
				{ new: true },
			);
			client.configs.set(message.guild.id, DBConfig as configType);
			message.reply({
				content: GetLanguage("RestrictedAllCommandsToAChannel", config.language)
					?.replaceAll("{commandsAmount}", args[0])
					.replaceAll("{channel}", channel.toString()),
			}); //
		} else {
			const command =
				client.commands.get(args[0]) ||
				client.commands.get(client.aliases.get(args[0]) as string);
			if (!command) {
				message.reply({
					content: GetLanguage("CommandNotFound", config.language),
				});
				return;
			}
			if (!commandRestricts[command.getName()])
				commandRestricts[command.getName()] = [];
			if (commandRestricts[command.getName()].includes(channel.id)) {
				message.reply({
					content: GetLanguage(
						"ChannelIsAlreadyInCommandRestricts",
						config.language,
					),
				});
				return;
			}
			commandRestricts[command.getName()].push(channel.id);
			const DBConfig: any = await GuildConfig.findOneAndUpdate(
				{ guildId: message.guild.id, clientId: client.user?.id },
				{ commandRestricts },
				{ new: true },
			);
			client.configs.set(message.guild.id, DBConfig as configType);
			message.reply({
				content: GetLanguage("CommandGotRestricted", config.language)
					?.replaceAll("{commandName}", command.getName())
					.replaceAll("{channel}", channel.toString()),
			});
		}
	}
}
