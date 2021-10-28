import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getRole from "../../utils/constants/getRole";
import { GuildConfig } from "../../utils/MongoDB/Models";
import configType from "../../utils/types/GuildConfig";

export default class Command extends BaseCommand {
	constructor() {
		super({
			name: "add-member-join-role",
			category: "join roles",
			aliases: [],
			userPermissions: ["MANAGE_ROLES"],
			botPermissions: [],
			tutorialGif:
				"https://cdn.discordapp.com/attachments/849666813545283645/903177707825799188/bandicam_2021-10-28_09-58-54-080.gif",
		});
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		const cachedConfig = await getConfig(client, message.guild?.id as string);
		let { memberJoinRoles } = cachedConfig;
		if (!memberJoinRoles) memberJoinRoles = [];
		const role = await getRole({ message, query: args.join(" ") });
		if (!role) {
			message.reply({
				content: GetLanguage("RoleNotFound", cachedConfig.language),
			});
			return;
		}
		if (memberJoinRoles.includes(role.id)) {
			message.reply({
				content: GetLanguage(
					"RoleAlreadyExistsInTheDatabase",
					cachedConfig.language,
				),
			});
			return;
		}
		if (!role.editable) {
			message.reply({
				content: GetLanguage(
					"BotIsMissingEditRolePerms",
					cachedConfig.language,
				),
			});
			return;
		}
		memberJoinRoles.push(role.id);
		const config = await GuildConfig.findOneAndUpdate(
			{
				guildId: message.guild?.id as string,
				clientId: client.user?.id,
			},
			{
				memberJoinRoles,
			},
			{ new: true },
		);

		client.configs.set(message.guild?.id as string, config as configType);
		await message.reply({
			content: GetLanguage("AddedNewMemberJoinRole", cachedConfig.language)
				.replaceAll("{role}", role.name)
				.replaceAll("{id}", role.id),
		});
	}
}
