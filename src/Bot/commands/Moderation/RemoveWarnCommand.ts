import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";
import { WarnsSchema } from "../../utils/MongoDB/Models";
import WarnsType from "../../utils/types/WarnsType";

export default class Command extends BaseCommand {
	constructor() {
		super({
			name: "remove-warn",
			category: "moderation",
			aliases: [],
			userPermissions: ["KICK_MEMBERS"],
			botPermissions: [],
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
				content: GetLanguage("WarnIDIsRequired", language),
			});
			return;
		}
		if (!args[1]) {
			message.reply({
				content: GetLanguage("MemberIsRequired", language),
			});
			return;
		}
		const warnString = args[0];
		args.shift();
		let member = await getMember({
			message,
			query: args.join(" "),
		});

		if (!member) {
			message.reply({ content: GetLanguage("MemberNotFound", language) });
			return;
		}
		let memberWarns: any = await WarnsSchema.findOne({
			user: member.user.id,
			guild: message.guild.id,
		});

		if (!memberWarns) {
			message.reply({
				content: GetLanguage("NoWarnsFound", language),
			});
			return;
		} else {
			let warn: number = parseInt(warnString, 10);
			if (isNaN(warn)) {
				message.reply({
					content: GetLanguage("NumberIsRequired", language),
				});
				return;
			}

			let warns: Array<WarnsType> = memberWarns.warns as WarnsType[];
			let index = warn - 1;
			if (!warns[index]) {
				message.reply({
					content: GetLanguage("WarnDoesNotExist", language),
				});
				return;
			}
			warns.splice(index, 1);

			memberWarns = await WarnsSchema.findOneAndUpdate(
				{
					user: member.user.id,
					guild: message.guild?.id,
				},
				{
					warns,
				},
				{ new: true },
			);

			message.reply({
				content: GetLanguage("WarnGotRemoved", language)?.replaceAll(
					"{number}",
					warn.toString(),
				),
			});
		}
	}
}
