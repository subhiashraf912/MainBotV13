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
      name: "enable",
      category: "moderation",
      aliases: [],
      userPermissions: ["MANAGE_GUILD"],
      botPermissions: ["MANAGE_GUILD"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member) return;
    const config = await getConfig(client, message.guild.id);
    const { language } = config;
    let disabledCommands = config?.disabledCommands;
    if (!disabledCommands) disabledCommands = {};
    const command =
      client.commands.get(args[0]) ||
      client.commands.get(client.aliases.get(args[0]) as string);
    if (!command) {
      message.reply(GetLanguage("CommandNotFound", language));
      return;
    }
    if (
      !disabledCommands[command.getName()] ||
      disabledCommands[command.getName()] === false
    ) {
      message.reply(GetLanguage("CommandIsAlreadyEnabled", language));
      return;
    }
    disabledCommands[command.getName()] = false;
    const DatabaseConfig: any = await GuildConfig.findOneAndUpdate(
      { guildId: message.guild.id, clientId: client.user?.id },
      { disabledCommands },
      { new: true }
    );
    if (DatabaseConfig) {
      client.configs.set(message.guild.id, DatabaseConfig as configType);
      await message.reply(
        GetLanguage("CommandHasBeenEnabled", language).replaceAll(
          "{command}",
          command.getName()
        )
      );
    } else return;
  }
}
