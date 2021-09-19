import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";

export default class JumpCommand extends BaseCommand {
  constructor() {
    super({
      name: "jump",
      category: "music",
      aliases: ["skipto", "skip-to"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.member || !message.guild || !message.guild.me) return;
    const config = await getConfig(client, message.guild.id);
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
        content: GetLanguage("SongsToJumpNumberRequired", config.language),
      });
      return;
    }
    const songsNumber = parseInt(args[0], 10);
    if (isNaN(songsNumber)) {
      message.reply({
        content: GetLanguage("ArgumentIsNotANumber", config.language).replace(
          "{argument}",
          args[0]
        ),
      });
      return;
    }

    if (queue.songs.length < songsNumber) {
      message.reply({
        content: GetLanguage(
          "SongsAmountShouldBeLessThanTheQueueLength",
          config.language
        ),
      });
      return;
    }
    client.distube.jump(message, songsNumber);
  }
}
