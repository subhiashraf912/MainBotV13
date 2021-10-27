import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "upload-sticker",
      category: "utility",
      aliases: [],
      userPermissions: ["MANAGE_EMOJIS_AND_STICKERS"],
      botPermissions: ["MANAGE_EMOJIS_AND_STICKERS"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);
    const sticker = message.stickers.first();
    if (!sticker) {
      message.reply({
        content: GetLanguage(
          "MemberNeedsToSendStickerWithTheMessage",
          config.language
        ),
      });
      return;
    }
    try {
      await message.guild?.stickers.create(
        sticker.url,
        sticker.name,
        (sticker.tags as string[])[0],
        {
          description: sticker.description,
          reason: `By ${message.author}`,
        }
      );
      message.react("☑");
    } catch (err: any) {
      message.channel.send({ content: err.message });
      message.react("✖");
    }
  }
}
