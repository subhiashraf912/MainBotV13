import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { splitBar } from "string-progressbar";
import GetLanguage from "../../utils/Languages";
import getConfig from "../../utils/constants/getConfig";
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "now-playing",
      category: "music",
      aliases: ["np"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.member || !message.guild || !message.guild.me) return;
    const config = await getConfig(client, message.guild.id);
    if (!message.member.voice.channel) {
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
    if (!queue.songs[0]) return;

    const song = queue.songs[0];
    const seek = queue.currentTime;

    const embed = new MessageEmbed()
      .setTitle(GetLanguage("NowPlaying", config.language))
      .setColor("RED")
      .setAuthor(
        queue.songs[0].user?.tag ||
          GetLanguage("UnknownSongRequester", config.language)
      )
      .setThumbnail(queue.songs[0].thumbnail ? queue.songs[0].thumbnail : "")
      .setTimestamp(new Date())
      .addField(
        GetLanguage("RequestedBy", config.language),
        `\`\`\`css\n${
          queue.songs[0].member?.user.tag ||
          GetLanguage("UnknownUser", config.language)
        }\`\`\``,
        true
      )
      .addField(
        GetLanguage("AutoPlay", config.language),
        `\`\`\`css\n${
          queue.autoplay
            ? GetLanguage("On", config.language)
            : GetLanguage("Off", config.language)
        }\`\`\``,
        true
      )
      .addField(
        GetLanguage("Filters", config.language),
        `\`\`\`css\n${
          queue.filters[0]
            ? queue.filters[0]
            : GetLanguage("NoFilters", config.language)
        }\`\`\``,
        true
      )
      .addField(
        GetLanguage("Volume", config.language),
        `\`\`\`css\n${queue.volume.toString()}\`\`\``,
        true
      )
      .addField(
        GetLanguage("RepeatMode", config.language),
        `\`\`\`css\n${
          queue.repeatMode
            ? queue.repeatMode === 2
              ? GetLanguage("AllQueue", config.language)
              : GetLanguage("ThisSong", config.language)
            : GetLanguage("Off", config.language)
        }\`\`\``,
        true
      )
      .addField(
        GetLanguage("CurrentlyPaused", config.language),
        `\`\`\`css\n${
          queue.paused
            ? GetLanguage("Yes", config.language)
            : GetLanguage("No", config.language)
        }\`\`\``,
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
            ? ` ◉ ${GetLanguage("Live", config.language)}`
            : new Date(song.duration * 1000).toISOString().substr(11, 8))
        }`,
        false
      );
    }

    message.reply({ embeds: [embed] });
  }
}
