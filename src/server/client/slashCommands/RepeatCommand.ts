import { CommandInteraction } from "discord.js";
import DiscordClient from "../classes/client";
import BaseSlashCommand from "../utils/structures/BaseSlashCommand";

export default class RepeatCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "repeat",
      description:
        "Using this command you can repeat the song/queue as much as you want!",
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

    let modeToBeSet: number;
    if (queue.repeatMode === 0) modeToBeSet = 1;
    else if (queue.repeatMode === 1) modeToBeSet = 2;
    else modeToBeSet = 0;
    let mode: number = client.distube.setRepeatMode(
      member.guild.id,
      modeToBeSet
    );
    const loopMode: string = mode
      ? mode == 2
        ? "Repeat queue"
        : "Repeat song"
      : "Off";
    interaction.editReply({
      content: "Set repeat mode to `" + loopMode + "`",
    });
  }
}
