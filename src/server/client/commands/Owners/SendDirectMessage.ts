import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";
import getUser from "../../utils/constants/getUser";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "dm",
      category: "owner",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const attachment = message.attachments.first();
    const config = await getConfig(client, message.guild?.id as string);
    const member = await getUser({
      message,
      query: args[0],
    });
    if (!member) {
      message.reply({
        content: GetLanguage("UserNotFound", config.language),
      });
      return;
    }
    args.shift();
    const content = args.join(" ");
    if (attachment) {
      member
        .send({ content, files: [attachment] })
        .then(() => {
          message.react("☑");
        })
        .catch(() => {
          message.react("✖");
        });
    } else {
      member
        .send(content)
        .then(() => {
          message.react("☑");
        })
        .catch(() => {
          message.react("✖");
        });
    }
  }
}
