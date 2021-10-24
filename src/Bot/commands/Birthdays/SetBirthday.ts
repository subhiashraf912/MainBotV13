import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import { BirthdaysSchema } from "../../utils/MongoDB/Models";
import mongoose from "mongoose";
export default class Command extends BaseCommand {
	constructor() {
		super({
			name: "set-birthday",
			category: "birthdays",
			aliases: [],
			userPermissions: [],
			botPermissions: [],
			tutorialGif: "",
		});
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (!message.guild || !message.member) return;
		let day = parseInt(args[0], 10);
		let month = parseInt(args[1], 10);
		let year = parseInt(args[2], 10);

		const cachedConfig = await getConfig(client, message.guild.id);
		const { prefix } = cachedConfig;
		if (!day || !month) {
			message.reply({
				content: GetLanguage(
					"MemberDidNotEnterDayAndMonthInTheSetBirthdayCommand",
					cachedConfig.language,
				).replaceAll("{perfix}", prefix),
			});
			return;
		}

		if (day > 31 || day < 1) {
			message.reply({
				content: GetLanguage("InvalidDay", cachedConfig.language),
			});
			return;
		}
		if (month > 12 || month < 1) {
			message.reply({
				content: GetLanguage("InvalidMonth", cachedConfig.language),
			});
			return;
		}
		if (year && year > new Date().getFullYear() - 14) {
			message.reply({
				content: GetLanguage(
					"MemberIsLessThan13YearsOld",
					cachedConfig.language,
				),
			});
			return;
		}
		if (year && year < new Date().getFullYear() - 50) {
			message.reply({
				content: GetLanguage(
					"MemberIsMoreThan50YearsOld",
					cachedConfig.language,
				),
			});
			return;
		}
		let current = await BirthdaysSchema.findOne({
			user: message.author.id,
		});

		let bd;
		if (args[0] === "clear") {
			bd = null;
		}
		if (args[0] !== "clear") {
			bd = args.join("-");
		}
		if (!current)
			await BirthdaysSchema.create({
				_id: new mongoose.Types.ObjectId(),
				user: message.author.id,
				birthday: bd,
			});
		if (current)
			await BirthdaysSchema.findOneAndUpdate(
				{ user: message.author.id },
				{ $set: { birthday: bd } },
				{ new: true },
			);
		await message.reply({
			content: GetLanguage(
				"BirthdayHasBeenUpdated",
				cachedConfig.language,
			).replaceAll("{member}", message.member.toString()),
		});
	}
}
