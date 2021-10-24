import { Message, MessageEmbed, TextChannel, User } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import pagination from "../../utils/constants/pagination";
export default class EvalCommand extends BaseCommand {
	constructor() {
		super({
			name: "eval",
			category: "owner",
		});
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		const content = args.join(" ");
		const result = new Promise((resolve) => resolve(eval(content)));
		result
			.then(async (output: any) => {
				if (typeof output !== "string")
					output = require("util").inspect(output, {
						depth: 0,
						maxArrayLength: Infinity,
					});
				output = output.toString();
				if (output.includes(client.token))
					output = output.replaceAll(client.token, "DISCORD_TOKEN");
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
			})
			.catch((err) => {
				err = err.toString();
				if (err.includes(client.token)) {
					err = err.replaceAll(client.token, "DISCORD_TOKEN");
				}
				message.reply({ content: err.message });
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
