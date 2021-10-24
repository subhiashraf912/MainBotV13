import { Guild, Message, MessageEmbed, TextChannel } from "discord.js";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import getUser from "../../utils/constants/getUser";
import pagination from "../../utils/constants/pagination";
import GetLanguage from "../../utils/Languages";
import { RankSchema } from "../../utils/MongoDB/Models";
import BaseCommand from "../../utils/structures/BaseCommand";
import configType from "../../utils/types/GuildConfig";
import RankType from "../../utils/types/RankType";

export default class Command extends BaseCommand {
	constructor() {
		super({
			name: "leaderboard",
			category: "levels",
		});
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		if (!message.member || !message.guild) return;
		const config = await getConfig(client, message.guild.id);
		function compare(a: any, b: any) {
			let comparison = 0;
			if (a.xp > b.xp) comparison = -1;
			if (a.xp < b.xp) comparison = 1;
			if (a.level > b.level) comparison = -1;
			if (a.level < b.level) comparison = +1;

			return comparison;
		}

		let ranks: Array<RankType> = await RankSchema.find({
			server: message.guild.id,
		});
		if (!ranks) {
			message.reply({
				content: GetLanguage("NoRanksWereFound", config.language),
			});
			return;
		}
		let TotalXpForUsers: { ID: string; xp: number; level: number }[] = [];
		for (const [key, value] of Object.entries(ranks)) {
			TotalXpForUsers.push({
				ID: value.user,
				xp: value.xp,
				level: value.level,
			});
		}
		TotalXpForUsers.sort(compare);
		const embeds = await GenerateLeaderboardsEmbed(
			client,
			TotalXpForUsers,
			message,
			config,
		);
		pagination({
			embeds,
			message,
			fastSkip: true,
			pageTravel: true,
		});
	}
}

async function GenerateLeaderboardsEmbed(
	client: DiscordClient,
	leaderboards: { ID: string; xp: number; level: number }[],
	message: Message,
	config: configType,
) {
	const guild = message.guild as Guild;
	const embeds = [];
	let k = 5;
	let x = 0;
	for (let i = 0; i < leaderboards.length; i += 5) {
		const current = leaderboards.slice(i, k);
		let j = i;
		k += 5;
		const icon: string = guild.iconURL({ dynamic: true, size: 4096 }) || "";

		const embed = new MessageEmbed()
			.setTitle(
				GetLanguage("ServerLeaderboardList", config.language).replaceAll(
					"{guild}",
					guild.name,
				),
			)
			.setThumbnail(icon);
		let description = `\`\`\`${GetLanguage(
			"ServerLeaderboardList",
			config.language,
		).replaceAll("{guild}", guild.name)}\`\`\``;
		for (const element of current) {
			let member = await getUser({ query: element.ID, message });
			if (member) {
				description = `${description}\n${x + 1}) ${
					member.username
				}| ${GetLanguage(
					"Exp",
					config.language,
				)}: ${element.xp.toString()} | ${GetLanguage(
					"Level",
					config.language,
				)}: ${element.level}`;
			} else {
				description = `${description}\n${x + 1}) ${GetLanguage(
					"UnknownUser",
					config.language,
				)} | ${GetLanguage(
					"Exp",
					config.language,
				)}: ${element.xp.toString()} | ${GetLanguage(
					"Level",
					config.language,
				)}: ${element.level}`;
			}
			x = x + 1;
		}

		embeds.push(embed);
	}
	return embeds;
}
