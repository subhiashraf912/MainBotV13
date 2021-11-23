import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import { GuildConfig } from "../../utils/MongoDB/Models";
import configType from "../../../../types/GuildConfig";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "set-prefix",
      category: "moderation",
      aliases: [],
      userPermissions: ["MANAGE_GUILD"],
      botPermissions: ["MANAGE_GUILD"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member) return;
    const cachedConfig = await getConfig(client, message.guild.id);
    const { language } = cachedConfig;
    const prefix = args[0];
    if (!prefix) {
      message.reply(GetLanguage("PrefixIsRequired", language));
      return;
    }
    const guildId = message.guild.id;
    const config: any = await GuildConfig.findOneAndUpdate(
      { guildId, clientId: client.user?.id },
      { prefix },
      { new: true }
    );

    client.configs.set(guildId, config as configType);
    message.reply(
      GetLanguage("PrefixHasBeenUpdated", language).replaceAll(
        "{prefix}",
        prefix
      )
    );
  }
}
