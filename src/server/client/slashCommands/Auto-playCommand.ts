import { CommandInteraction, Message } from "discord.js";
import DiscordClient from "../classes/client";
import BaseSlashCommand from "../utils/structures/BaseSlashCommand";

export default class AutoPlayCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "auto-play",
      description:
        "Using this command you can toggle the auto play in the queue!",
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

    const mode = client.distube.toggleAutoplay(member.guild.id);
    interaction.editReply({
      content: "> Set autoplay mode to `" + (mode ? "On" : "Off") + "`",
    });
  }
}
