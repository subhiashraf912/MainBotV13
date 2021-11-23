import { CommandInteraction } from "discord.js";
import { DisTubeVoiceManager } from "distube";
import DiscordClient from "../classes/client";
import BaseSlashCommand from "../utils/structures/BaseSlashCommand";

export default class StopCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "stop",
      description: "Using this command you can stop the music from playing!",
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
    client.distube.stop(member.guild.id);
    const dtVoiceManager = new DisTubeVoiceManager(client.distube);
    dtVoiceManager.voices.leave(member.voice.channel);
    interaction.editReply("Stopped the music!");
  }
}
