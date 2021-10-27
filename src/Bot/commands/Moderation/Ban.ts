import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";

export default class Command extends BaseCommand {
	constructor() {
		super({
			name: "ban",
			category: "moderation",
			aliases: [],
			userPermissions: ["BAN_MEMBERS"],
			botPermissions: ["BAN_MEMBERS"],
			tutorialGif: "",
		});
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (!message.guild || !message.member) return;
		const config = await getConfig(client, message.guild.id);
		const language = config.language;
		message.deletable && message.delete();
		const memberToBan = await getMember({
			message,
			query: args[0],
			returnAuthor: false,
		});
		if (!memberToBan) {
			message.reply(
				GetLanguage("MemberMentionIsRequired", language).replaceAll(
					"{operation}",
					"Ban",
				),
			);
			return;
		}
		args.shift();
		let reason =
			args.join(" ") || GetLanguage("NoReasonProvided", config.language);
		memberToBan.bannable
			? memberToBan
					.ban({
						reason: `${GetLanguage(
							"ResponsibleUser",
							config.language,
						).replaceAll("{user}", message.author.tag)} ${reason}`,
					})
					.then(() =>
						message.reply(
							GetLanguage("MemberGotBanned", language)
								.replaceAll("{member}", memberToBan.user.tag)
								.replaceAll("{server}", message.guild?.name as string)
								.replaceAll("{reason}", reason),
						),
					)
			: message.channel.send(
					GetLanguage("MemberToBanHasAHigherRoleThanTheBot", language),
			  );
	}
}
