import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import DiscordClient from "../classes/client";
import { splitBar } from "string-progressbar";
import BaseSlashCommand from "../utils/structures/BaseSlashCommand";
export default class NowPlayingCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "now-playing",
      description: "Using this command you can find the now playing song!",
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

    const queue = client.distube.getQueue(member.guild.id);
    if (!queue) {
      interaction.editReply({
        content: "There's nothing playing in the queue right now!",
      });
      return;
    }
    const song = queue.songs[0];
    const seek = queue.currentTime;

    const embed = new MessageEmbed()
      .setTitle("Now Playing")
      .setColor("RED")
      .setAuthor(queue.songs[0].name || "Unknown song requester")
      .setThumbnail(queue.songs[0].thumbnail ? queue.songs[0].thumbnail : "")
      .setTimestamp(new Date())
      .addField(
        "Requested By:",
        `\`\`\`css\n${queue.songs[0].member?.user.tag || "Unkown user"}\`\`\``,
        true
      )
      .addField(
        "Auto Play",
        `\`\`\`css\n${queue.autoplay ? "On" : "Off"}\`\`\``,
        true
      )
      .addField(
        "Filters:",
        `\`\`\`css\n${
          queue.filters[0] ? queue.filters[0] : "No filters"
        }\`\`\``,
        true
      )
      .addField("Volume", `\`\`\`css\n${queue.volume.toString()}\`\`\``, true)
      .addField(
        "Repeat mode",
        `\`\`\`css\n${
          queue.repeatMode
            ? queue.repeatMode === 2
              ? "All Queue"
              : "This Song"
            : "Off"
        }\`\`\``,
        true
      )
      .addField(
        "Currently Paused:",
        `\`\`\`css\n${queue.paused ? "Yes" : "No"}\`\`\``,
        true
      );

    if (song.duration > 0) {
      embed.addField(
        "\u200b",
        `${
          new Date(seek * 1000).toISOString().substr(11, 8) +
          "⪕ " +
          splitBar(
            song.duration == 0 ? seek : song.duration,
            seek,
            15,
            undefined,
            "🔹"
          )[0] +
          " ⪘" +
          (song.isLive == true
            ? " ◉ LIVE"
            : new Date(song.duration * 1000).toISOString().substr(11, 8))
        }`,
        false
      );
    }

    interaction.editReply({ embeds: [embed] });
  }
}
