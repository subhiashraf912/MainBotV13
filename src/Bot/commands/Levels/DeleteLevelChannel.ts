import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getChannel from "../../utils/constants/getChannel";
import { GuildConfig } from "../../utils/MongoDB/Models";
import configType from "../../utils/types/GuildConfig";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "delete-level-channel",
      category: "levels",
      aliases: [],
      userPermissions: ["MANAGE_GUILD"],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const cachedConfig = await getConfig(client, message.guild?.id as string);

    const { language } = cachedConfig;
    let levelsChannels: Array<string> = cachedConfig.levelsChannels;
    if (!levelsChannels) levelsChannels = [];

    if (!args[0]) {
      message.reply({
        content: GetLanguage("ChannelMentionIsRequired", language),
      });
      return;
    }
    const channel = getChannel({
      message,
      query: args.join(" "),
    });

    if (!channel) {
      message.reply({
        content: GetLanguage("ChannelNotFound", language),
      });
      return;
    }

    if (!levelsChannels.includes(channel.id)) {
      message.reply({
        content: GetLanguage("ChannelDoesNotExistInTheLevelChannels", language),
      });
      return;
    }
    const index = levelsChannels.indexOf(channel.id);

    levelsChannels.splice(index, 1);
    const config = await GuildConfig.findOneAndUpdate(
      {
        guildId: message.guild?.id as string,
        clientId: client.user?.id,
      },
      {
        levelsChannels,
      },
      { new: true }
    );

    client.configs.set(message.guild?.id as string, config as configType);
    message.reply(
      GetLanguage("RemovedLevelChannel", language).replaceAll(
        "{channel}",
        channel.toString()
      )
    );
  }
}
