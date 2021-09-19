import { Song, Queue } from "distube";
import DisTubeBaseEvent from "../utils/structures/DistubeBaseEvent";
import { MessageEmbed } from "discord.js";
import DiscordClient from "../client/client";
import getConfig from "../utils/constants/getConfig";
import GetLanguage from "../utils/Languages";
export default class PlaySongEvent extends DisTubeBaseEvent {
  constructor() {
    super("playSong");
  }
  async run(client: DiscordClient, queue: Queue, song: Song) {
    if (queue.textChannel) {
      const config = await getConfig(client, queue.textChannel.guild.id);
      const embed = new MessageEmbed()
        .setTitle(
          GetLanguage(
            "DisTubePlaySongEventPlayingSong",
            config.language
          ) as string
        )
        .addField(
          GetLanguage("DisTubePlaySongEventSongName", config.language),
          song.name ||
            GetLanguage("DisTubePlaySongEventUnknownSongName", config.language)
        )
        .addField(
          GetLanguage("Duration", config.language),
          song.formattedDuration ||
            GetLanguage("UnknownDuration", config.language),
          true
        )
        .addField(
          GetLanguage("AddedBy", config.language) as string,
          song.user
            ? song.user.toString()
            : (GetLanguage("UnknownUser", config.language) as string),
          true
        )
        .setThumbnail(song.thumbnail ? song.thumbnail : "");
      queue.textChannel.send({ embeds: [embed] }).then((msg) => {
        client.currentPlayingSong.set(msg.guild?.id as string, msg);
      });
      if (queue.textChannel.guild.me) {
        !queue.textChannel.guild.me.voice.deaf &&
          queue.textChannel.guild.me.voice.setDeaf(true);
      }
    }
  }
}
