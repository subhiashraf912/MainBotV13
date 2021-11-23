import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "clear-nick",
      category: "moderation",
      aliases: [],
      userPermissions: ["MANAGE_NICKNAMES"],
      botPermissions: ["MANAGE_NICKNAMES"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.member || !message.guild) return;

    const config = await getConfig(client, message.guild.id);
    const language = config.language;
    const member = await getMember({
      message,
      query: args[0],
      returnAuthor: true,
    });

    if (!member) {
      message.reply({
        content: GetLanguage("MemberNotFound", language),
      });
      return;
    }
    await member
      .setNickname(
        "",
        GetLanguage("ResponsibleUser", config.language).replaceAll(
          "{user}",
          message.author.tag
        )
      )
      .catch((err) => {
        message.reply(
          `${GetLanguage("ErrorOccured", language)}\n${err.message}`
        );
        return;
      });

    await message.reply({
      content: GetLanguage("BotHasClearedANickname", language)
        .replaceAll("{target}", member.user.tag)
        .replaceAll("{author}", message.author.tag),
    });
  }
}
