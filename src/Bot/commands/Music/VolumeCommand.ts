import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import GetLanguage from "../../utils/Languages";
import getConfig from "../../utils/constants/getConfig";

export default class VolumeCommand extends BaseCommand {
  constructor() {
    super({
      name: "volume",
      category: "music",
      aliases: ["v"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.member || !message.guild || !message.guild.me) return;
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
    if (!args[0]) {
      message.reply({
        content: GetLanguage("VolumeAmount", config.language).replace(
          "{volume}",
          queue.volume.toString()
        ),
      });
      return;
    }
    const volume = parseInt(args[0]);
    if (isNaN(volume)) {
      message.reply({
        content: GetLanguage("ArgumentIsNotANumber", config.language).replace(
          "{argument}",
          volume.toString()
        ),
      });
      return;
    }
    if (volume > 100) {
      message.reply({
        content: GetLanguage("MaxVolumeIs100", config.language),
      });
      return;
    }
    if (volume < 0) {
      message.reply({
        content: GetLanguage("MinVolumeIs0", config.language),
      });
      return;
    }
    client.distube.setVolume(message, volume);
    client.queueVolume = volume;

    message.reply({
      content: GetLanguage("VolumeGotChanged", config.language).replace(
        "{volume}",
        volume.toString()
      ),
    });
  }
}
