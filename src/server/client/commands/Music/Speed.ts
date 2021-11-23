import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import GetLanguage from "../../utils/Languages";
import getConfig from "../../utils/constants/getConfig";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "speed",
      category: "music",
      aliases: ["sp"],
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
    if (!args[0]) {
      message.reply({
        content: GetLanguage(
          "MemberNeedsToEnterTheSpeedOfTheSong",
          config.language
        ),
      });
      return;
    }
    const speedNum = parseInt(args[0], 10);
    if (isNaN(speedNum)) {
      message.reply({
        content: GetLanguage(
          "ArgumentIsNotANumber",
          config.language
        ).replaceAll("{argument}", args[0]),
      });
      return;
    }
    let supportedSpeeds = [
      "0.25",
      "0.5",
      "0.75",
      "1",
      "1.25",
      "1.5",
      "1.75",
      "2",
    ];
    let supportedSpeedMessage = "";
    supportedSpeeds.forEach((sp) => {
      supportedSpeedMessage = `${supportedSpeedMessage} \`${sp}\``;
    });
    if (!supportedSpeeds.includes(args[0])) {
      message.reply({
        content: GetLanguage("SpeedIsNotSupported", config.language).replaceAll(
          "{arguments}",
          supportedSpeedMessage
        ),
      });
      return;
    }
    client.distube.setFilter(message, args[0]);
    message.reply({
      content: GetLanguage("TheSpeedGotChanged", config.language).replaceAll(
        "{speed}",
        args[0]
      ),
    });
  }
}
