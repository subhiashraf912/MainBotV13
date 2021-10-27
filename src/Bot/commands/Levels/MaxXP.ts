import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import { GuildConfig } from "../../utils/MongoDB/Models";
import configType from "../../utils/types/GuildConfig";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "max-xp",
      category: "levels",
      aliases: [],
      userPermissions: ["MANAGE_GUILD"],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member) return;
    const cachedConfig = await getConfig(client, message.guild?.id as string);
    if (!cachedConfig) return;
    const { language } = cachedConfig;
    let maxXpPerMessage: number = cachedConfig.maxXpPerMessage;
    if (!maxXpPerMessage) maxXpPerMessage = 15;

    if (!args[0]) {
      message.reply(
        GetLanguage("MaximumXPAmount", language).replaceAll(
          "{xp}",
          maxXpPerMessage.toString()
        )
      );
      return;
    }

    const newAmount = parseInt(args[0], 10);
    if (isNaN(newAmount)) {
      message.reply(GetLanguage("NumberIsRequired", language));
      return;
    }
    const config = await GuildConfig.findOneAndUpdate(
      {
        guildId: message.guild.id,
        clientId: client.user?.id,
      },
      { $set: { maxXpPerMessage: newAmount } },
      { new: true }
    );

    client.configs.set(message.guild.id, config as configType);
    message.reply(
      GetLanguage("MaxXpPerMessageHasBeenUpdated", language).replaceAll(
        "{xp}",
        newAmount.toString()
      )
    );
  }
}
