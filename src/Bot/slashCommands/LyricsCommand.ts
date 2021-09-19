import { CommandInteraction, MessageEmbed } from "discord.js";
import DiscordClient from "../client/client";
import BaseSlashCommand from "../utils/structures/BaseSlashCommand";
const Genius = require("genius-lyrics");
const lyricsFinder = new Genius.Client();
export default class LyricsCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "lyrics",
      description: "Using this command you can find the lyrics of any song!",
      options: [
        {
          name: "song",
          description:
            "Enter the song name and the arist like this [artist - song name] without the [].",
          type: "STRING",
          required: true,
        },
      ],
    });
  }

  async run(
    client: DiscordClient,
    interaction: CommandInteraction,
    args: Array<string>
  ) {
    const member = client.guilds.cache
      .get(interaction.guildId as string)
      ?.members.cache.get(interaction.member?.user?.id as string);
    if (!member) return;
    let lyrics = null;
    const [song] = args;
    if (!song) {
      interaction.editReply({ content: "You need to enter the song, dummy." });
    }
    try {
      const searches = await lyricsFinder.songs.search(song);
      const firstSong = searches[0];
      lyrics = await firstSong.lyrics();
    } catch (error) {
      lyrics = `No lyrics found for ${args.join(" ")}.`;
    }
    let lyricsEmbed = new MessageEmbed()
      .setTitle("Lyrics")
      .setDescription(lyrics)
      .setColor("#F8AA2A")
      .setTimestamp();
    if (lyrics >= 2048)
      lyricsEmbed.description = `${lyrics.substr(0, 2045)}...`;
    interaction.editReply({ embeds: [lyricsEmbed] }).catch(console.error);
  }
}
