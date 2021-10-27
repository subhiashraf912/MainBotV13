import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import GetLanguage from "../../utils/Languages";
import getConfig from "../../utils/constants/getConfig";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "filter",
      category: "music",
      aliases: ["set-filter", "setfilter"],
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
    if (args[0] === "off" && queue.filters)
      client.distube.setFilter(message, false);
    else if (Object.keys(client.distube.filters).includes(args[0]))
      client.distube.setFilter(message, args[0]);
    else if (args[0]) {
      message.reply({
        content: GetLanguage("NotAValidFilter", config.language),
      });
      return;
    }
    message.reply(
      `${GetLanguage("CurrentQueueFilter", config.language)}: \`${
        queue.filters[0] ? queue.filters : GetLanguage("Off", config.language)
      }\``
    );
  }
}
