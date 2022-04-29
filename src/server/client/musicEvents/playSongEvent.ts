import { Song, Queue } from "distube";
import DisTubeBaseEvent from "../utils/structures/DistubeBaseEvent";
import { MessageEmbed } from "discord.js";
import DiscordClient from "../classes/client";
import getConfig from "../utils/constants/getConfig";
import GetLanguage from "../utils/Languages";
export default class PlaySongEvent extends DisTubeBaseEvent {
  constructor() {
    super("playSong");
  }
  async run(client: DiscordClient, queue: Queue, song: Song) {
    if (queue.textChannel?.id === "969509588221198366") {
      const messages = await queue.textChannel.messages.fetch({ limit: 1 });
      const embed = new MessageEmbed()
        .setTitle("Playing Song")
        .addField("Name:", song.name || "No name for this song")
        .addField("Uploaded By:", song.uploader.name || "Unknown uploader")
        .setFooter({
          text: "Duration:" + song.formattedDuration || "Unknown Duration",
          iconURL: "https://yt3.ggpht.com/mmqDQ-MMsKt5NIlhTkc2zEdfP2QtaKZR6BJ00_QItcNURyylh0sbEE00n63QIXaDoKZMPOfPWw=s256-c-k-c0x00ffffff-no-rj",
        })
        .setImage(song.thumbnail || "https://wallpaperaccess.com/full/1783942.jpg");
      if (messages.first()) messages.first()?.edit({ embeds: [embed] });
      else queue.textChannel.send({ embeds: [embed] });
      return;
    }
    if (queue.textChannel) {
      const config = await getConfig(client, queue.textChannel.guild.id);
      const embed = new MessageEmbed()
        .setTitle(GetLanguage("DisTubePlaySongEventPlayingSong", config.language) as string)
        .addField(GetLanguage("DisTubePlaySongEventSongName", config.language), song.name || GetLanguage("DisTubePlaySongEventUknownSongName", config.language))
        .addField(GetLanguage("Duration", config.language), song.formattedDuration || GetLanguage("UnknownDuration", config.language), true)
        .addField(GetLanguage("AddedBy", config.language) as string, song.user ? song.user.toString() : (GetLanguage("UnknownUser", config.language) as string), true)
        .setThumbnail(song.thumbnail ? song.thumbnail : "");
      queue.textChannel.send({ embeds: [embed] }).then((msg) => {
        client.currentPlayingSong.set(msg.guild?.id as string, msg);
      });
      if (queue.textChannel.guild.me) {
        !queue.textChannel.guild.me.voice.deaf && queue.textChannel.guild.me.voice.setDeaf(true);
      }
    }
  }
}
