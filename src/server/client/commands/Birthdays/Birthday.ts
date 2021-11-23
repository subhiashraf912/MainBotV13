import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getUser from "../../utils/constants/getUser";
import { BirthdaysSchema } from "../../utils/MongoDB/Models";
import { GetBirthday } from "../../utils/constants/Functions";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "birthday",
      category: "birthdays",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member) return;
    const config = await getConfig(client, message.guild.id);
    const user =
      (await getUser({
        query: args.join(" "),
        message,
      })) || message.author;
    const BD: any = await BirthdaysSchema.findOne({
      user: user.id,
    });
    if (!BD) {
      message.reply({
        content: GetLanguage("BirthdayWasNotFound", config.language).replaceAll(
          "{user}",
          user.username
        ),
      });
      return;
    }
    message.reply(
      `> ● ${GetLanguage("Member'sBirthday", config.language)
        .replaceAll("{user}", user.username)
        .replaceAll("{birthday}", GetBirthday(BD.birthday))}`
    );
  }
}
