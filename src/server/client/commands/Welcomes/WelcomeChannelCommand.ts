import { Message, TextChannel } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import { GuildConfig } from "../../utils/MongoDB/Models";
import GetLanguage from "../../utils/Languages";
import getConfig from "../../utils/constants/getConfig";

export default class WelcomeChannelCommand extends BaseCommand {
  constructor() {
    super({
      name: "welcome-channel",
      category: "Welcomes",
      userPermissions: ["MANAGE_CHANNELS"],
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member) return;
    let channel = message.mentions.channels.first();
    const cachedConfig = await getConfig(client, message.guild.id);
    if (!channel && args[0] !== "default") {
      message.reply(
        GetLanguage("MemberNeedsToMentionAChannel", cachedConfig.language)
      );
      return;
    }
    if (channel && args[0] !== "default") {
      if ((channel as TextChannel).guild.id !== message.guild.id) {
        message.reply(
          GetLanguage(
            "TheChannelNeedsToBeInTheSameServer",
            cachedConfig.language
          )
        );
        return;
      }
      if (channel.type !== "GUILD_TEXT") {
        message.reply(
          GetLanguage("TextChannelRequired", cachedConfig.language)
        );
        return;
      }
    }

    if (args[0] === "default") channel = undefined;
    const welcomeChannel = channel ? channel.id : null;
    const config = await GuildConfig.findOneAndUpdate(
      { guildId: message.guild.id },
      { welcomeChannel },
      { new: true }
    );
    client.configs.set(message.guild.id, config!);
    channel
      ? message.reply("The welcome channel has been updated!")
      : message.reply(
          "The welcome channel has been rested to default (no channels)!"
        );
  }
}
