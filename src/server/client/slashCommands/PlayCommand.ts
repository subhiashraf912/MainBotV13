import { CommandInteraction, TextChannel } from "discord.js";
import DiscordClient from "../classes/client";
import BaseSlashCommand from "../utils/structures/BaseSlashCommand";

export default class PlayCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "play",
      description:
        "You can play any song, almost from all the websites including spotify!",
      options: [
        {
          name: "song",
          description: "Enter the song url or name",
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

    const [song] = args;
    if (!song) {
      interaction.editReply({
        content: "You need to enter the song to play music!",
      });
      return;
    }

    const voiceChannel = member.voice.channel;
    client.distube
      ?.play(voiceChannel, song, {
        member,
        textChannel: member.guild.channels.cache.get(
          interaction.channelId
        ) as TextChannel,
      })
      .catch((err) => {
        interaction.editReply({ content: err.message });
      });
    interaction.editReply("🔍 Searching for data");
  }
}
