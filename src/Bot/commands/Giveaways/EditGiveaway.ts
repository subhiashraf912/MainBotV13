import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import ms from "ms";
export default class Command extends BaseCommand {
	constructor() {
		super({
			name: "edit-giveaway",
			category: "giveaways",
			aliases: [],
			userPermissions: ["MANAGE_GUILD"],
			botPermissions: [],
			tutorialGif: "",
		});
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (!message.guild || !message.member) return;
		const messageID = args[0];
		const config = await getConfig(client, message.guild.id);
		if (!messageID) {
			message.reply({
				content: GetLanguage("GiveawayMessageIDIsRequired", config.language),
			});
			return;
		}
		client.giveawaysManager
			.edit(messageID, {
				addTime: ms(args[1]),
				newWinnerCount: parseInt(args[2], 10),
				newPrize: args.slice(3).join(" "),
				newMessages: {
					giveaway: GetLanguage("GiveawayTitle", config.language),
					giveawayEnded: GetLanguage("GiveawayEnded", config.language),
					timeRemaining: GetLanguage("GiveawayRemainingTime", config.language),
					inviteToParticipate: GetLanguage(
						"GiveawayReactMessage",
						config.language,
					),
					winMessage: GetLanguage("GiveawayWinMessage", config.language),
					embedFooter: GetLanguage(
						"GiveawayEmbedFooter",
						config.language,
					).replaceAll("{clientUsername}", client.user?.username as string),
					noWinner: GetLanguage("GiveawayCanceled", config.language),
					hostedBy: GetLanguage("GiveawayHostedBy", config.language),
					winners: GetLanguage("Winners", config.language),
					endedAt: GetLanguage("EndedAt", config.language),
					units: {
						seconds: GetLanguage("Seconds", config.language),
						minutes: GetLanguage("Minutes", config.language),
						hours: GetLanguage("Hours", config.language),
						days: GetLanguage("Days", config.language),
						pluralS: false, // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
					},
				},
			})
			.then(() => {
				// Here, we can calculate the time after which we are sure that the lib will update the giveaway
				const numberOfSecondsMax =
					(client.giveawaysManager?.options?.updateCountdownEvery as number) /
					1000;
				message.reply(
					GetLanguage("EditGiveawaySuccess", config.language).replaceAll(
						"{secs}",
						numberOfSecondsMax.toString(),
					),
				);
			})
			.catch((err) => {
				message.reply(
					GetLanguage("NoGiveawayWasFound", config.language).replaceAll(
						"messageId",
						messageID,
					),
				);
			});
	}
}
