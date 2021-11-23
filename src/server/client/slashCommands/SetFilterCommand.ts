import { CommandInteraction } from "discord.js";
import DiscordClient from "../classes/client";
import filters from "../utils/constants/filters";
import BaseSlashCommand from "../utils/structures/BaseSlashCommand";

export default class SeekCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "filter",
      description: "Using this command you can change the filters of the song!",
      options: [
        {
          name: "filter",
          description: "Enter the seek amount",
          type: "STRING",
          required: true,
          choices: filters,
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

    const [filter] = args;
    if (!filter) {
      interaction.editReply({
        content: "You need to enter the filter you want!",
      });
      return;
    }

    const queue = client.distube.getQueue(member.guild.id);
    if (!queue) {
      interaction.editReply({
        content: `There is nothing in the queue right now!`,
      });
      return;
    }
    if (filter === "off" && queue.filters)
      client.distube.setFilter(member.guild.id, false);
    else if (Object.keys(client.distube.filters).includes(filter))
      client.distube.setFilter(member.guild.id, filter);
    else if (filter) {
      interaction.editReply({ content: `Not a valid filter` });
      return;
    }

    interaction.editReply({
      content: `Current Queue Filter: \`${
        queue.filters[0] ? queue.filters : "Off"
      }\``,
    });
  }
}
