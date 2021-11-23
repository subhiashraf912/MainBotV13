import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "set-nick",
      category: "moderation",
      aliases: [],
      userPermissions: ["MANAGE_NICKNAMES"],
      botPermissions: ["MANAGE_NICKNAMES"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member) return;
    const cachedConfig = await getConfig(client, message.guild.id);
    const { language } = cachedConfig;

    const member = await getMember({
      message,
      query: args[0],
    });

    if (!member) {
      message.reply(GetLanguage("MemberNotFound", language));
      return;
    }

    args.shift();
    const nick = args.join(" ");
    member
      .setNickname(nick, `By: ${message.author.tag}`)
      .then(() => {
        message.reply({ content: GetLanguage("NicknameGotChanged", language) });
      })
      .catch((err) => {
        message.reply(
          `${GetLanguage("ErrorOccured", language)}\n\`\`\`js\n${
            err.message
          }\`\`\``
        );
        return;
      });
  }
}
