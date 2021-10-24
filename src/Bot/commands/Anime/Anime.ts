import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
const mal = require("mal-scraper");
export default class Command extends BaseCommand {
	constructor() {
		super({
			name: "anime",
			category: "anime",
			aliases: [],
			userPermissions: [],
			botPermissions: [],
			tutorialGif: "",
		});
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		let searchMessage = args.join(" ");
		const config = await getConfig(client, message.guild?.id as string);
		if (!searchMessage || searchMessage === "") {
			message.reply({
				content: GetLanguage("EnterAnimeNameToSearchAbout", config.language),
			});
			return;
		}

		const data = await mal.getInfoFromName(args.join(" "));
		if (!data) {
			message.reply({
				content: GetLanguage("NoAnimeFound", config.language),
			});
			return;
		}
		let studios = "";
		data.studios.forEach((element: string) => {
			studios = `${studios} \`${element}\``;
		});

		let producers = "";
		data.producers.forEach((element: string) => {
			producers = `${producers} \`${element}\``;
		});

		let genres = "";
		data.genres.forEach((element: string) => {
			genres = `${genres} \`${element}\``;
		});

		let embed = new MessageEmbed()
			.setTitle(data.title)
			.addField(
				`${GetLanguage("OtherNames", config.language)}:`,
				`**${GetLanguage("English", config.language)}:** \`${
					data.englishTitle
				}\` **${GetLanguage("Japanese", config.language)}:** \`${
					data.japaneseTitle
				}\``,
			)
			.addField(
				`${GetLanguage("Studios", config.language)}:`,
				`${studios}`,
				true,
			)
			.addField(
				`${GetLanguage("Producers", config.language)}:`,
				`${producers}`,
				true,
			)
			.addField(
				`${GetLanguage("Episodes", config.language)}:`,
				`\`${data.episodes} episodes\``,
				true,
			)
			.addField(
				`${GetLanguage("Length", config.language)}:`,
				`\`${data.duration}\``,
				true,
			)
			.addField(
				`${GetLanguage("Aired", config.language)}:`,
				`\`${data.aired}\``,
				true,
			)
			.addField(
				`${GetLanguage("Premiered", config.language)}:`,
				`\`${data.premiered}\``,
				true,
			)
			.addField(
				`${GetLanguage("Status", config.language)}:`,
				`\`${data.status}\``,
				true,
			)
			.addField(
				`${GetLanguage("Broadcast", config.language)}:`,
				`\`${data.broadcast}\``,
				true,
			)
			.addField(
				`${GetLanguage("Rating", config.language)}:`,
				`\`${data.rating}\``,
			)
			.addField(`${GetLanguage("Genres", config.language)}:`, `${genres}`)
			.addField(
				`${GetLanguage("Score", config.language)}:`,
				`\`${data.score}\` \`${data.scoreStats}\``,
				true,
			)
			.addField(
				`${GetLanguage("WorldRank", config.language)}:`,
				`\`${data.ranked}\``,
				true,
			)
			.addField(
				`${GetLanguage("Popularity", config.language)}:`,
				`\`${data.popularity}\``,
				true,
			)
			.setColor(`RANDOM`)
			.setDescription(data.synopsis)
			.setThumbnail(data.picture)
			.setFooter(
				GetLanguage("AnimeFavBy", config.language).replaceAll(
					"{favorites}",
					data.favorites,
				),
			);

		message.reply({ embeds: [embed] });
	}
}
