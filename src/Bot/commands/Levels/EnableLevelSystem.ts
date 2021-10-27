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
      name: "enable-level-system",
      category: "levels",
      aliases: [],
      userPermissions: ["MANAGE_GUILD"],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const cachedConfig = await getConfig(client, message.guild?.id as string);

    const { isLevelSystemEnabled, language } = cachedConfig;
    if (isLevelSystemEnabled) {
      message.reply({
        content: GetLanguage("LevelSystemIsAlreadyEnabled", language),
      });
      return;
    }

    const config = await GuildConfig.findOneAndUpdate(
      {
        guildId: message.guild?.id as string,
        clientId: client.user?.id,
      },
      { isLevelSystemEnabled: true },
      {
        new: true,
      }
    );

    client.configs.set(message.guild?.id as string, config as configType);

    message.reply(GetLanguage("LevelSystemGotEnabled", language));
  }
}
