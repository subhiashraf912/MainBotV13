import { CommandInteraction } from "discord.js";
import DiscordClient from "../client/client";
import BaseSlashCommand from "../utils/structures/BaseSlashCommand";

export default class PauseCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "pause",
      description: "Using this command you can pause the playing music!",
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

    if (client.distube.getQueue(member.guild.id)?.paused) {
      interaction.editReply("Queue is already paused ma nigga!");
      return;
    }
    client.distube.pause(member.guild.id);
    interaction.editReply({
      content: "Paused the queue by " + member.toString(),
    });
  }
}
