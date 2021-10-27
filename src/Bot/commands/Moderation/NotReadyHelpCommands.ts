import { Message, MessageEmbed, User } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import pagination from "../../utils/constants/pagination";

export default class Command extends BaseCommand {
	constructor() {
		super({
			name: "not-ready-help-commands",
			category: "moderation",
			aliases: [],
			userPermissions: ["MANAGE_ROLES"],
			botPermissions: ["MANAGE_ROLES"],
			tutorialGif: "",
		});
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		const config = await getConfig(client, message.guildId as string);
		let output = "";
		client.commands.forEach((command) => {
			if (
				GetLanguage(`${command.getName()}_description`, config.language) ===
				"Hasn't been added yet."
			) {
				output = `${output}\n${command.getName()}_description`;
			}
			if (
				GetLanguage(`${command.getName()}_usage`, config.language) ===
				"Hasn't been added yet."
			) {
				output = `${output}\n${command.getName()}_usage`;
			}
		});

		const length = output.length;
		const texts = [];
		const parts = length / 2000;
		for (let i = 0; i < parts; i++) {
			texts.push(output.substring(i * 2000, (i + 1) * 2000));
		}
		const embeds = generateFilesEmbed(texts, message.author);
		pagination({
			message,
			embeds,
			pageTravel: true,
			fastSkip: true,
		});
	}
}

function generateFilesEmbed(texts: string[], author: User): MessageEmbed[] {
	const embeds = [];
	let k = 1;
	for (let i = 0; i < texts.length; i += 1) {
		const r = texts.slice(i, k);
		let j = i;
		k += 1;
		let info = "";
		r.forEach((text) => {
			info = `${info}\n${text}`;
		});

		const embed = new MessageEmbed()
			.setDescription(
				`\`\`\`ts\n
        ${info}
        \`\`\``,
			)
			.setFooter(
				`Requested by: ${author.tag}`,
				author.displayAvatarURL({
					dynamic: true,
					size: 4096,
				}),
			);
		embeds.push(embed);
	}
	return embeds;
}
