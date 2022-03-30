import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "play-skip",
      category: "music",
      aliases: ["playskip", "ps"],
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
    let songURL: string | undefined = "";
    if (message.attachments.first()) songURL = message.attachments.first()?.url;
    if (!args[0] && message.attachments.first())
      return client.distube?.play(message.member.voice.channel, songURL as string).catch((err) => {
        message.reply({ content: `${err.message}` });
      });

    if (!args.join(" ").includes("http")) {
      const search = await client.distube.search(args.join(" "), {
        limit: 1,
        type: "video",
      });
      if (!search[0]) {
        message.reply({
          content: GetLanguage("NoDataWereFound", config.language),
        });
        return;
      }
      client.distube?.play(message.member.voice.channel, search[0].url, { skip: true });
    } else {
      client.distube?.play(message.member.voice.channel, args.join(" "), { skip: true });
    }
  }
}
