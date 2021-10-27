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
      name: "unrestrict",
      category: "moderation",
      aliases: [],
      userPermissions: ["MANAGE_GUILD"],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member) return;
    const config = await getConfig(client, message.guild.id);
    let commandRestricts = config.commandRestricts;
    const channel = message.mentions.channels.first();

    if (args[0] === "all") {
      client.commands.forEach((command) => {
        if (!commandRestricts[command.getName()])
          commandRestricts[command.getName()] = [];
        if (channel) {
          if (!commandRestricts[command.getName()].includes(channel.id)) {
            message.reply({
              content: GetLanguage(
                "ChannelDoesNotExistInTheList",
                config.language
              ),
            });
            return;
          }
          const index = commandRestricts[command.getName()].indexOf(channel.id);
          commandRestricts[command.getName()].splice(index, 1);
          if (commandRestricts[command.getName()].length === 0)
            commandRestricts[command.getName()] = null;
        } else {
          commandRestricts[command.getName()] = null;
        }
      });

      const DBConfig: any = await GuildConfig.findOneAndUpdate(
        { guildId: message.guild.id, clientId: client.user?.id },
        { commandRestricts },
        { new: true }
      );
      client.configs.set(message.guild.id, DBConfig as configType);
      if (channel)
        message.reply({
          content: GetLanguage(
            "RemovedAllCommandsFromRestricts",
            config.language
          )
            .replaceAll("{channel}", channel.toString())
            .replaceAll("{commands}", client.commands.size.toString()),
        });
      else
        message.reply({
          content: GetLanguage(
            "RemovedAllCommandsFromRestrictsWithoutChannels",
            config.language
          ),
        });
    } else {
      const command =
        client.commands.get(args[0]) ||
        client.commands.get(client.aliases.get(args[0]) as string);
      if (!command) {
        message.reply({
          content: GetLanguage("CommandNotFound", config.language),
        });
        return;
      }
      if (!commandRestricts[command.getName()])
        commandRestricts[command.getName()] = [];
      if (channel) {
        if (!commandRestricts[command.getName()].includes(channel.id)) {
          message.reply({
            content: GetLanguage(
              "ChannelDoesNotExistInTheList",
              config.language
            ),
          });
          return;
        }
        const index = commandRestricts[command.getName()].indexOf(channel.id);
        commandRestricts[command.getName()].splice(index, 1);
        if (commandRestricts[command.getName()].length === 0)
          commandRestricts[command.getName()] = null;
        message.reply({
          content: GetLanguage(
            "RemovedChannelFromCommandRestrict",
            config.language
          )
            .replaceAll("{channel}", channel.toString())
            .replaceAll("{commandName}", command.getName()),
        });
      } else {
        commandRestricts[command.getName()] = null;
        message.reply({
          content: GetLanguage(
            "RemovedRestrictsFromCommand",
            config.language
          ).replaceAll("{commandName}", command.getName()),
        });
      }

      const DBConfig: any = await GuildConfig.findOneAndUpdate(
        { guildId: message.guild.id, clientId: client.user?.id },
        { commandRestricts },
        { new: true }
      );

      client.configs.set(message.guild.id, DBConfig as configType);
    }
  }
}
