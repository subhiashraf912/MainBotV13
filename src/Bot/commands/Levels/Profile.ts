import { Activity, GuildMember, Message, MessageAttachment } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";
import {
	BirthdaysSchema,
	CreditsSchema,
	RankBackgroundSchema,
	RankSchema,
} from "../../utils/MongoDB/Models";
import RankType from "../../utils/types/RankType";
import { Profile } from "../../utils/Modules/AzeCord";
import { GetBirthday } from "../../utils/constants/Functions";

export default class Command extends BaseCommand {
	constructor() {
		super({
			name: "profile",
			category: "levels",
			aliases: [],
			userPermissions: [],
			botPermissions: ["ATTACH_FILES"],
			tutorialGif: "",
		});
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		const config = await getConfig(client, message.guild?.id as string);
		if (!message.guild || !message.member) return;

		const member = (await getMember({
			message,
			query: args.join(" "),
			returnAuthor: true,
		})) as GuildMember;

		let memberAvatar: string = member.user.displayAvatarURL({
			format: "png",
			size: 4096,
		});
		let memberUserName: string = member.user.username;
		let Discriminator: string = member.user.discriminator;

		let data = client.ranks.get(`${member.user.id}-${member.guild.id}`);
		let rankBackground: any = client.rankBackgrounds.get(member.user.id);
		if (!data) {
			data = (await RankSchema.findOne({
				user: member.user.id,
				server: member.guild.id,
			})) as RankType;
			if (!data) {
				message.reply({
					content: GetLanguage(
						"MemberDoesNotHaveARank",
						config.language,
					).replaceAll("{member}", member.user.tag),
				});
				return;
			}
			client.ranks.set(`${member.user.id}-${member.guild.id}`, data);
		}
		if (!rankBackground) {
			rankBackground = await RankBackgroundSchema.findOne({
				user: member.user.id,
			});
			if (!rankBackground) {
				rankBackground = await RankBackgroundSchema.create({
					user: member.user.id,
					rankBackground: null,
				});
			}
			if (!rankBackground) return;
			client.rankBackgrounds.set(member.id, rankBackground);
		}
		let Credits = await CreditsSchema.findOne({
			user: member.id,
		});

		if (!Credits) {
			Credits = await CreditsSchema.create({
				user: member.id,
				credits: 0,
				lastDaily: Date.now(),
			});
		}
		let color, color2, color3;
		switch (member.presence?.status) {
			case "offline":
				color = "#f2f1ef";
				color2 = "#abb7b7";
				color3 = "#dadfe1";
			case "online":
				color = "#55ff34";
				color2 = "#199900";
				color3 = "#87ff70";
			case "dnd":
				color = "#ff4642";
				color2 = "#f50500";
				color3 = "#ffb4b3";
			case "idle":
				color = "#fff528";
				color2 = "#b8af00";
				color3 = "#423f00";
			case "invisible":
				color = "#f2f1ef";
				color2 = "#abb7b7";
				color3 = "#dadfe1";
			default:
				color = "#f2f1ef";
				color2 = "#abb7b7";
				color3 = "#dadfe1";
		}

		let perms = "Member";
		if (
			member.permissions.has("KICK_MEMBERS") ||
			member.permissions.has("BAN_MEMBERS")
		)
			perms = "Moderator";
		if (member.permissions.has("MANAGE_GUILD")) perms = "Server Manager";
		if (member.permissions.has("ADMINISTRATOR")) perms = "Server Admin";
		if (member.id === message.guild.ownerId) perms = "Server Owner";

		const creationDate = new Date(member.user.createdAt).toDateString();
		const profile = new Profile()
			.setAvatar(memberAvatar)
			.setCurrentXP(data.xp)
			.setRequiredXP(5 * Math.pow(data.level, 2) + 50 * data.level + 100)
			.setStatus(member.presence?.status)
			.setProgressBar("#FFFFFF", "COLOR")
			.setUsername(memberUserName)
			.setDiscriminator(Discriminator)
			.setLevel(data.level)
			.setCustomStatusColor(color as string)
			.setCash(Credits.credits, color)
			.setProgressBar(
				[color as string, color2 as string, color3 as string],
				"GRADIENT",
			)
			.setLevelColor(undefined, color)
			.setId(member.id)
			.setActivities(member.presence?.activities as Activity[])
			.setCreatedAt(creationDate)
			.setJoinedAt(new Date(member.joinedAt as Date).toDateString())
			.setPerms(perms);

		const BirthdaySchema = await BirthdaysSchema.findOne({
			user: member.user.id,
		});
		if (rankBackground.rankBackground) {
			profile.setBackground("IMAGE", rankBackground.rankBackground);
		}
		if (BirthdaySchema) {
			profile.setBirthDay(GetBirthday(BirthdaySchema.birthday));
		} else {
			profile.setBirthDay(`no birthday`);
		}
		profile.build().then((data: any) => {
			const attachment = new MessageAttachment(data, "ProfileCard.png");
			message.reply({ files: [attachment] });
		});
	}
}
