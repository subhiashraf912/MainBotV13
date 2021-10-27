import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import GetLanguage from "../../utils/Languages";
import GetConfig from "../../utils/constants/getConfig";
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "pause",
      category: "music",
      aliases: ["pa"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await GetConfig(client, message.guild?.id as string);
    if (!message.member?.voice.channel) {
      message.reply({
        content: GetLanguage("MemberNeedsToBeInAVoiceChannel", config.language),
      });
      return;
    }

    if (
      message.guild?.me?.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    ) {
      message.reply({
        content: GetLanguage(
          "MemberNeedsToBeInTheSameVoiceChannelAsTheBot",
          config.language
        ),
      });
      return;
    }
    const queue = client.distube.getQueue(message);
    if (!queue) {
      message.reply({
        content: GetLanguage("NoQueue", config.language),
      });
      return;
    }
    if (client.distube.getQueue(message.guild?.id as string)?.paused) {
      message.reply({
        content: GetLanguage("QueueIsAlreadyPaused", config.language),
      });
      return;
    }
    client.distube.pause(message);
    message.reply({
      content: GetLanguage("QueueGotPaused", config.language).replaceAll(
        "{member}",
        message.author.toString()
      ),
    });
  }
}
