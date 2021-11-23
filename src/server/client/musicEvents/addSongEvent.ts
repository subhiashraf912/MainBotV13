import DisTubeBaseEvent from "../utils/structures/DistubeBaseEvent";
import { MessageEmbed } from "discord.js";
import { Song, Queue } from "distube";
import DiscordClient from "../classes/client";
import getConfig from "../utils/constants/getConfig";
import GetLanguage from "../utils/Languages";
export default class AddSongEvent extends DisTubeBaseEvent {
  constructor() {
    super("addSong");
  }
  async run(client: DiscordClient, queue: Queue, song: Song) {
    if (queue.textChannel && queue.songs.length > 1) {
      const config = await getConfig(client, queue.textChannel.guildId);
      const embed = new MessageEmbed()
        .setTitle(GetLanguage("DistubeAddSongEventEmbedTitle", config.language))
        .addField(
          GetLanguage("DistubeAddSongEventEmbedSongFeild", config.language),
          song.name || GetLanguage("NoName", config.language)
        )
        .addField(
          GetLanguage("SongDuration", config.language),
          song.formattedDuration ||
            GetLanguage("UnknownDuration", config.language),
          true
        )
        .addField(
          GetLanguage("AddedBy", config.language),
          song.user
            ? song.user.toString()
            : GetLanguage("UnknownUser", config.language),
          true
        )
        .setThumbnail(song.thumbnail ? song.thumbnail : "");
      queue.textChannel.send({ embeds: [embed] });
    }
  }
}
