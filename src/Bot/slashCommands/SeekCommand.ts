import { CommandInteraction } from "discord.js";
import DiscordClient from "../client/client";
import BaseSlashCommand from "../utils/structures/BaseSlashCommand";

export default class SeekCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "seek",
      description:
        "This commands lets's you change the time of the current playing song!",
      options: [
        {
          name: "amount",
          description: "Enter the seek amount",
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

    const [amount] = args;
    if (!amount) {
      interaction.editReply({
        content: "You need to enter the amount you want to seek to!",
      });
      return;
    }
    const SeekAmount = parseInt(amount, 10);
    client.distube.seek(member.guild.id, SeekAmount);
  }
}
