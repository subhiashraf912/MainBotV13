import { CommandInteraction, Message } from "discord.js";
import DiscordClient from "../client/client";
import BaseSlashCommand from "../utils/structures/BaseSlashCommand";

export default class JumpCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "jump",
      description: "This command skips how many songs you want in the queue!",
      options: [
        {
          name: "amount",
          description: "Enter the number of the songs you want to skip.",
          type: "NUMBER",
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
        content: `| There is nothing playing in the queue right now!`,
      });
      return;
    }
    const [amount] = args;
    if (!amount) {
      interaction.editReply({
        content: "You need to send the number of the songs you want to jump!",
      });
      return;
    }

    const songsNumber = parseInt(amount, 10);
    if (isNaN(songsNumber)) {
      interaction.editReply({
        content: `${amount} is not a number!`,
      });
      return;
    }

    if (queue.songs.length < songsNumber) {
      interaction.editReply({
        content: "The songs amount must be less than the queue length!",
      });
      return;
    }
    client.distube.jump(member.guild.id, songsNumber);
  }
}
