import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "add-related-song",
      category: "music",
      aliases: ["addrelatedsong", "ars", "a-r-s"],
      userPermissions: ["CONNECT"],
      botPermissions: ["CONNECT", "SPEAK"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (client.distube) {
      const config = await getConfig(client, message.guild?.id as string);
      if (!message.member?.voice.channel) {
        message.reply({
          content: GetLanguage(
            "MemberNeedsToBeInAVoiceChannel",
            config.language
          ),
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

      if (!client.distube.getQueue(message)) {
        message.reply({
          content: GetLanguage("NoQueue", config.language),
        });
        return;
      }
      const song = await client.distube.addRelatedSong(message);
      await message.reply({
        content: GetLanguage("AddedSong", config.language).replaceAll(
          "{song}",
          `\`${song.name}\`` || "`Unkown Song`"
        ),
      });
    }
  }
}
