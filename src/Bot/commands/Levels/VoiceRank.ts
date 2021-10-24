import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";
import { VoiceRankSchema } from "../../utils/MongoDB/Models";
import VoiceRankType from "../../utils/types/VoiceRankType";

export default class Command extends BaseCommand {
	constructor() {
		super({
			name: "voice-rank",
			category: "levels",
			aliases: [],
			userPermissions: [],
			botPermissions: [],
			tutorialGif: "",
		});
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		const config = await getConfig(client, message.guild?.id as string);
		if (!message.guild || !message.member) return;
		let member = await getMember({
			message,
			query: args.join(" "),
			returnAuthor: true,
		});

		let rank = client.voiceRanks.get(`${member.guild.id}-${member.user.id}`);
		if (!rank) {
			rank = (await VoiceRankSchema.findOne({
				server: member.guild.id,
				user: member.user.id,
			})) as VoiceRankType;
			if (!rank) {
				message.reply({
					content: GetLanguage("NoDataWereFoundForMember", config.language),
				});
				return;
			}
			client.voiceRanks.set(`${member.guild.id}-${member.user.id}`, rank);
		}

		message.reply({
			content: GetLanguage("VoiceLevelData", config.language)
				.replaceAll("{member}", member.user.tag)
				.replaceAll("{time}", millisToMinutesAndSeconds(rank.voiceTime)),
		});
	}
}

const millisToMinutesAndSeconds = (timeInMiliseconds: number) => {
	let h, m, s;
	h = Math.floor(timeInMiliseconds / 1000 / 60 / 60);
	m = Math.floor((timeInMiliseconds / 1000 / 60 / 60 - h) * 60);
	s = Math.floor(((timeInMiliseconds / 1000 / 60 / 60 - h) * 60 - m) * 60);
	return `${h} Hours - ${m} Minutes - ${s} Secs`;
};
