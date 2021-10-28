import { Message, MessageEmbed, Role, TextChannel, User } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import pagination from "../../utils/constants/pagination";
import getDevelopers from "../../utils/constants/GetDevelopers";

export default class Command extends BaseCommand {
	constructor() {
		super({
			name: "bot-join-roles",
			category: "join roles",
			aliases: [],
			userPermissions: ["MANAGE_ROLES"],
			botPermissions: [],
			tutorialGif:
				"https://cdn.discordapp.com/attachments/900321704289656872/903191420775596042/BotJoinRoles.gif",
		});
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		const config = await getConfig(client, message.guild?.id as string);
		let { language } = config;
		const { botJoinRoles } = config;
		if (!botJoinRoles || !botJoinRoles[0]) {
			message.reply(GetLanguage("ThereAreNoBotJoinRoles", language));
			return;
		}
		const roles: Role[] = [];
		botJoinRoles.forEach((roleId) => {
			const role = message.guild?.roles.cache.get(roleId);
			role && roles.push(role);
		});
		const developer = await getDevelopers({ client });
		const embeds = generateRolesEmbed(roles, developer, language);
		pagination({
			message,
			embeds,
			fastSkip: true,
			pageTravel: true,
		});
	}
}

function generateRolesEmbed(roles: Role[], developer: User, language: string) {
	const embeds = [];
	let k = 10;
	for (let i = 0; i < roles.length; i += 10) {
		const r = roles.slice(i, k);
		let j = i;
		k += 10;
		let info = "";
		r.forEach((role) => {
			info = `${info}\n> **${++j}-**${role} \`id: ${role.id}\`\n`;
		});

		const embed = new MessageEmbed()
			.setDescription(
				`\`\`\`💢${GetLanguage("BotAutoJoinRole", language)}: ${
					roles.length
				}💢\`\`\`\`\`\`⚡${GetLanguage(
					"BotAutoJoinRolesDescsription",
					language,
				)}⚡\`\`\`${info}`,
			)
			.setFooter(
				`${GetLanguage("Developer", language)}: ${developer.tag}`,
				developer.displayAvatarURL({ dynamic: true }),
			);
		embeds.push(embed);
	}
	return embeds;
}
