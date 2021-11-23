import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import { SearchResult } from "distube";
import GetLanguage from "../../utils/Languages";
import getConfig from "../../utils/constants/getConfig";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "search",
      category: "music",
      aliases: ["se"],
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

    if (!args[0]) {
      message.reply({
        content: GetLanguage("ArgumentsAreMissing", config.language),
      });
      return;
    }
    const searchResults: Array<SearchResult> = await client.distube.search(
      args.join(" "),
      {
        limit: 10,
      }
    );
    const embed: MessageEmbed = new MessageEmbed()
      .setTitle(GetLanguage("SearchResult", config.language))
      .setThumbnail(
        searchResults[0].thumbnail ? searchResults[0].thumbnail : ""
      );

    let i = 0;
    searchResults.forEach((res) => {
      i++;
      embed.addField(
        `**${i}- **${res.name}`,
        `${
          res.isLive
            ? GetLanguage("Live", config.language)
            : GetLanguage("NotALiveVideo", config.language)
        } | ${res.formattedDuration} | ${GetLanguage(
          "Views",
          config.language
        )}: ${res.views}`
      );
    });
    message.reply({ embeds: [embed] });

    const filter = (m: Message) =>
      message.author.id === m.author.id &&
      parseInt(m.content) <= searchResults.length;
    try {
      const response = await message.channel.awaitMessages({
        filter,
        max: 1,
        time: 10000,
        errors: ["time"],
      });
      if (response) {
        if (!response.first()) return;
        const entry: any = response.first()?.content;
        client.distube.play(message, searchResults[entry - 1].url);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
