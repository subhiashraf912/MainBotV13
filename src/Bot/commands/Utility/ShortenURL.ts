import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
const shortUrl = require("node-url-shortener");

export default class Command extends BaseCommand {
	constructor() {
		super({
			name: "shorten-url",
			category: "utility",
			aliases: ["short-url", "shorturl", "shortenurl"],
			userPermissions: [],
			botPermissions: [],
			tutorialGif: "",
		});
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		const config = await getConfig(client, message.guild?.id as string);
		shortUrl.short(args.join(" "), function (err: Error, url: string) {
			if (err) return message.reply(err.message);
			else
				message.reply(
					`${GetLanguage("YourShortURL", config.language)}: ${url}`,
				);
		});
	}
}
