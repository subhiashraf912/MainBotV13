import { CommandInteraction } from "discord.js";
import DiscordClient from "../classes/client";
import BaseSlashCommand from "../utils/structures/BaseSlashCommand";

export default class VolumeCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "volume",
      description:
        "Using this command you can change the volume of the current playing song!",
      options: [
        {
          name: "volume",
          description: "Enter the volume amount",
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

    const [volume] = args;
    const queue = client.distube.getQueue(member.guild.id);
    if (!queue) {
      interaction.editReply({
        content: "There's notthing playing right now in the queue!",
      });
      return;
    }
    if (!volume) {
      interaction.editReply({
        content: "You need to enter the amount you want to seek to!",
      });
      return;
    }
    if (!volume) {
      interaction.editReply(`🔊| Volume is :${queue?.volume}`);
      return;
    }
    const volAmount = parseInt(args[0]);
    if (isNaN(volAmount)) {
      interaction.editReply(`Please enter a valid number!`);
      return;
    }
    if (volAmount > 100) {
      interaction.editReply("Max volume is 100!");
      return;
    }
    if (volAmount < 0) {
      interaction.editReply("Min volume is 0!");
      return;
    }
    client.distube.setVolume(member.guild.id, volAmount);
    client.queueVolume = volAmount;
    interaction.editReply(`Volume set to \`${volume}\``);
  }
}
