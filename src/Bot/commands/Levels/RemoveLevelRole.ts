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
      name: "remove-level-role",
      category: "levels",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const cachedConfig = await getConfig(client, message.guild?.id as string);
    const { language, prefix } = cachedConfig;
    let { levelRoles } = cachedConfig;
    if (!args[0]) {
      message.reply(
        GetLanguage("RemoveLevelRoleWrongSyntax", language).replace(
          "{prefix}",
          prefix
        )
      );
      return;
    }

    //@ts-ignore
    if (!levelRoles[args[0]]) {
      message.reply(GetLanguage("LevelWasNotFoundInTheDatabase", language));
      return;
    }
    //@ts-ignore
    delete levelRoles[args[0]];

    const config = await GuildConfig.findOneAndUpdate(
      { guildId: message.guild?.id, clientId: client.user?.id },
      { $set: { levelRoles } },
      { new: true }
    );
    client.configs.set(message.guild?.id as string, config as configType);
    message.reply(
      GetLanguage("LevelRoleGotRemoved", language).replace("{level}", args[0])
    );
  }
}