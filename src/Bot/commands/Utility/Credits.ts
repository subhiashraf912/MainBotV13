import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import { CreditsSchema } from "../../utils/MongoDB/Models";
import getUser from "../../utils/constants/getUser";

export default class Command extends BaseCommand {
	constructor() {
		super({
			name: "credits",
			category: "utility",
			aliases: ["bal", "cash"],
			userPermissions: [],
			botPermissions: [],
			tutorialGif: "",
		});
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		const cachedConfig = await getConfig(client, message.guild?.id as string);
		const { language } = cachedConfig;
		const target =
			(await getUser({
				message,
				query: args.join(""),
			})) || message.author;
		let Credits = await CreditsSchema.findOne({
			user: target.id,
		});

		if (!Credits) {
			Credits = await CreditsSchema.create({
				user: target.id,
				credits: 0,
				lastDaily: Date.now(),
			});
		}

		message.reply(
			`> ${GetLanguage("MemberCredits", language)
				.replaceAll("{credits}", Credits.credits.toString())
				.replaceAll("{member}", target.toString())}`,
		);
	}
}
