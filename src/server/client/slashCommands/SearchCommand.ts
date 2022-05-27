import {
  CommandInteraction,
  Message,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import DiscordClient from "../classes/client";
import BaseSlashCommand from "../utils/structures/BaseSlashCommand";
import { SearchResult } from "distube";

export default class SearchCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "search",
      description: "This command will search for your song on youtube!",
      options: [
        {
          name: "song",
          description: "Enter the song url or name",
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

    if (!member?.voice.channel) {
      interaction.editReply({
        content: `You need to be in a voice channel!`,
        // ephemeral: true,
      });
      return;
    }

    if (
      member.guild.me?.voice.channel &&
      member.voice.channel.id !== member.guild.me.voice.channel.id
    ) {
      interaction.editReply({
        content: "You need to be in the same voice channel as the bot!",
      });
      return;
    }

    const [song] = args;
    if (!song) {
      interaction.editReply({
        content: "You need to enter the song to search for music!",
      });
      return;
    }
    const voiceChannel = member.voice.channel;

    const searchResults: Array<SearchResult> = await client.distube.search(
      args.join(" "),
      {
        limit: 10,
      }
    );
    const embed: MessageEmbed = new MessageEmbed()
      .setTitle("Search Result")
      .setThumbnail(
        searchResults[0].thumbnail ? searchResults[0].thumbnail : ""
      );

    let i = 0;
    searchResults.forEach((res) => {
      i++;
      embed.addField(
        `**${i}- **${res.name}`,
        `${res.isLive ? "Live Video" : "Not A Live Video"} | ${
          res.formattedDuration
        } | Views: ${res.views}`
      );
    });
    interaction.editReply({ embeds: [embed] });

    const filter = (m: Message) =>
      member.user.id === m.author.id &&
      parseInt(m.content) <= searchResults.length;
    try {
      const response = await (
        member.guild.channels.cache.get(interaction.channelId) as TextChannel
      ).awaitMessages({
        filter,
        max: 1,
        time: 10000,
        errors: ["time"],
      });
      if (response) {
        if (!response.first()) return;
        const entry: any = response.first()?.content;
        client.distube?.play(voiceChannel, song, {
          member,
          textChannel: member.guild.channels.cache.get(
            interaction.channelId
          ) as TextChannel,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
