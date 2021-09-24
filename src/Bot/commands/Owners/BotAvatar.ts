import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "bot-avatar",
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
    if (!attachment) {
      message.reply({
        content: GetLanguage(
          "BotAvatarIsRequiredAsAnAttachment",
          config.language
        ),
      });
      return;
    }
    await client.user?.setAvatar(attachment.url);
    message.reply({
      content: GetLanguage("BotAvatarHasBeenUpdated", config.language),
    });
  }
}
