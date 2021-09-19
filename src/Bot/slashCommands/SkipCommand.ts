import { CommandInteraction } from "discord.js";
import DiscordClient from "../client/client";
import BaseSlashCommand from "../utils/structures/BaseSlashCommand";

export default class PlayCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "skip",
      description: "You can skip the current playing song using this command!",
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
    const queue = client.distube.getQueue(member.guild.id);
    if (!queue) {
      interaction.editReply({
        content: "There's nothing playing in the queue right now!",
      });
      return;
    }
    if (!queue.songs[1]) {
      interaction.editReply({
        content:
          "There're no other songs to skip! use stop command instead if you want to end the queue.",
      });
    }
    if (!queue.songs[1] && client.distube.getQueue(member.guild.id)?.autoplay) {
      client.distube.skip(member.guild.id as string);
      return;
    }
    if (!queue.songs[1]) return client.distube.stop(member.guild.id as string);
    client.distube.skip(member.guild.id);
    interaction.editReply({
      content: "Skipped the song!",
    });
  }
}
