import { CommandInteraction } from "discord.js";
import DiscordClient from "../client/client";
import BaseSlashCommand from "../utils/structures/BaseSlashCommand";

export default class PreviousCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "previous",
      description: "This command will play the previous song of the queue!",
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
      interaction.editReply(`| There is nothing playing!`);
      return;
    }
    if (!queue.previousSongs[0]) {
      interaction.editReply({ content: "There's on no previous song!" });
      return;
    }
    client.distube.previous(member.guild.id);
  }
}
