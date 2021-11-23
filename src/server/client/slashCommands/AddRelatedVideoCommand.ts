import { CommandInteraction } from "discord.js";
import DiscordClient from "../classes/client";
import BaseSlashCommand from "../utils/structures/BaseSlashCommand";

export default class AddRelatedVideoCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "add-related-song",
      description: "This command will add a random related song to the queue!",
    });
  }

  async run(
    client: DiscordClient,
    interaction: CommandInteraction,
    args: Array<string>
  ) {
    if (client.distube) {
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

      const song = await client.distube.addRelatedSong(member.guild.id);
      await interaction.editReply({
        content: `> Added ${song.name} to the queue :3`,
      });
    }
  }
}
