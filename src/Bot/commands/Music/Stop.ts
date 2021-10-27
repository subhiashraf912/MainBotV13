import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { DisTubeVoiceManager } from "distube";
import GetLanguage from "../../utils/Languages";
import getConfig from "../../utils/constants/getConfig";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "stop",
      category: "music",
      aliases: ["dc", "leave", "disconnect"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (
      !client.distube ||
      !message.member ||
      !message.guild ||
      !message.guild.me
    )
      return;
    const config = await getConfig(client, message.guild?.id as string);
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
    client.distube.stop(message);
    const dtVoiceManager = new DisTubeVoiceManager(client.distube);
    dtVoiceManager.voices.leave(message.member.voice.channel);
    message.reply({
      content: GetLanguage("TheMusicGotStopped", config.language),
    });
  }
}
