import { GuildChannel, Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getChannel from "../../utils/constants/getChannel";
import { GuildConfig } from "../../utils/MongoDB/Models";
import configType from "../../../../types/GuildConfig";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "set-ai-chat-channel",
      category: "utility",
      aliases: [],
      userPermissions: ["MANAGE_GUILD"],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member) return;
    const cachedConfig = await getConfig(client, message.guild.id);
    const mode = args[0];
    if (!mode) {
      message.reply({
        content: GetLanguage(
          "MemberNeedsToPassArgumentsForAIChat",
          cachedConfig.language
        ),
      });
      return;
    }
    const channelQuery = args.join(" ");
    let channel: GuildChannel | undefined = getChannel({
      query: channelQuery,
      message,
    });
    if (!channel && mode !== "default") {
      message.reply({
        content: GetLanguage(
          "MemberNeedsToMentionAChannel",
          cachedConfig.language
        ),
      });
      return;
    }
    if (channel && mode !== "default") {
      if (channel.guild?.id !== message.guild.id) {
        message.reply({
          content: GetLanguage(
            "TheChannelNeedsToBeInTheSameServer",
            cachedConfig.language
          ),
        });
        return;
      }
      if (channel.type !== "GUILD_TEXT") {
        message.reply({
          content: GetLanguage("TextChannelRequired", cachedConfig.language),
        });
        return;
      }
    }

    if (mode === "default") channel = undefined;
    const aiChatChannel = channel ? channel.id : null;
    const config: any = await GuildConfig.findOneAndUpdate(
      { guildId: message.guild.id, clientId: client.user?.id },
      { aiChatChannel },
      { new: true }
    );
    client.configs.set(message.guild.id, config as configType);
    channel
      ? message.reply({
          content: GetLanguage(
            "TheAIChatChannelHasBeenUpdated",
            cachedConfig.language
          ),
        })
      : message.reply({
          content: GetLanguage(
            "TheAIChatChannelHasBeenRestedToDefault",
            cachedConfig.language
          ),
        });
  }
}
