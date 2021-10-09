import { GuildChannel, Message } from "discord.js";
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
      name: "add-level-channel",
      category: "levels",
      aliases: [],
      userPermissions: ["MANAGE_GUILD"],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const cachedConfig = await getConfig(client, message.guild?.id as string);
    if (!message.guild || !message.member) return;

    const language = cachedConfig.language;
    let levelsChannels = cachedConfig.levelsChannels;
    if (!levelsChannels) levelsChannels = [];

    if (!args[0]) {
      message.reply(GetLanguage("ChannelMentionIsRequired", language));
      return;
    }
    const channel = getChannel({ query: args.join(" "), message });

    if (!channel) {
      message.reply(GetLanguage("ChannelNotFound", language));
      return;
    }
    if (channel.type !== "GUILD_TEXT") {
      message.reply(GetLanguage("TextChannelRequired", language));
      return;
    }
    if (levelsChannels.includes(channel.id)) {
      message.reply(GetLanguage("ChannelAlreadyInTheLevelsList", language));
      return;
    }
    levelsChannels.push(channel.id);

    const config = await GuildConfig.findOneAndUpdate(
      {
        guildId: message.guild.id,
      },
      {
        levelsChannels,
      },
      { new: true }
    );

    client.configs.set(message.guild.id, config as configType);
    message.reply(
      GetLanguage("AddedLevelChannel", language).replace(
        "{channel}",
        channel.toString()
      )
    );
  }
}
