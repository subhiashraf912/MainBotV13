import { CommandInteraction } from "discord.js";
import DiscordClient from "../classes/client";
import BaseSlashCommand from "../utils/structures/BaseSlashCommand";

export default class PauseCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "resume",
      description: "Using this command you can resume the paused music!",
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

    if (!client.distube.getQueue(member.guild.id)?.paused) {
      interaction.editReply("Song is already running ma nigga!");
      return;
    }
    client.distube.resume(member.guild.id);
    interaction.editReply({
      content: "Resumed the queue by " + member.toString(),
    });
  }
}
