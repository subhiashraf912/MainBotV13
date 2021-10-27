import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";
import getRole from "../../utils/constants/getRole";

export default class Command extends BaseCommand {
	constructor() {
		super({
			name: "add-role",
			category: "moderation",
			aliases: [],
			userPermissions: ["MANAGE_ROLES"],
			botPermissions: ["MANAGE_ROLES"],
			tutorialGif: "",
		});
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (!message.guild) return;
		if (!message.member) return;
		const cachedConfig = await getConfig(client, message.guild.id);
		const { language } = cachedConfig;
		if (!args[0]) {
			message.reply({
				content: GetLanguage("RoleAndMemberAreRequired", language),
			});
			return;
		}
		const role = await getRole({
			message,
			query: args[0],
		});
		args.shift();
		if (!args.join(" ")) {
			message.reply({
				content: GetLanguage("RoleAndMemberAreRequired", language),
			});
			return;
		}
		const member = await getMember({
			message,
			query: args.join(" "),
		});

		if (!member) {
			message.reply({
				content: GetLanguage("MemberNotFound", language),
			});
			return;
		}

		if (!role) {
			message.reply(GetLanguage("RoleNotFound", language));
			return;
		}
		if (!role.editable) {
			message.reply(GetLanguage("BotIsMissingEditRolePerms", language));
			return;
		}
		!member.roles.cache.has(role.id)
			? member.roles
					.add(role)
					.then(() =>
						message.reply(
							GetLanguage("MemberRoleAdded", language)
								.replaceAll("{role}", role.name)
								.replaceAll("{member}", member.user.username),
						),
					)
			: message.reply(GetLanguage("MemberHasTheRole", language));
	}
}
