import { CommandInteraction } from "discord.js";
import DiscordClient from "../classes/client";
import BaseSlashCommand from "../utils/structures/BaseSlashCommand";

export default class ShuffleCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "shuffle",
      description: "Using this command you can shuffle the whole queue!",
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

    client.distube.shuffle(member.guild.id);
    interaction.editReply("The queue has been shuffled!");
  }
}
