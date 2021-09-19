import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";

export default class RepeatCommand extends BaseCommand {
  constructor() {
    super({
      name: "repeat",
      category: "music",
      aliases: ["loop", "l"],
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

    let mode: number = client.distube.setRepeatMode(message);
    const loopMode: string = mode
      ? mode == 2
        ? GetLanguage("AllQueue", config.language)
        : GetLanguage("ThisSong", config.language)
      : GetLanguage("Off", config.language);
    message.reply({
      content:
        `${GetLanguage("RepeatModeGotChanged", config.language)}: \`` +
        loopMode +
        "`",
    });
  }
}
