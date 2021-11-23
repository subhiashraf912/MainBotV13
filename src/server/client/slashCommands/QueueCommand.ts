import { CommandInteraction, MessageEmbed, TextChannel } from "discord.js";
import DiscordClient from "../classes/client";
import { Song } from "distube";
import { Queue } from "distube";
import pagination from "../utils/constants/pagination";
import BaseSlashCommand from "../utils/structures/BaseSlashCommand";
export default class QueueCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "queue",
      description:
        "Using this command you can see the current queue in the server!",
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

    const queue = client.distube.getQueue(member.guild.id);
    if (!queue) {
      interaction.editReply({
        content: "There's nothing playing in the queue right now!",
      });
      return;
    }
    const current = queue.songs[0];
    const embeds = generateQueueEmbed(queue, current);
    await interaction.editReply({
      content: "Here's the queue of this server:",
    });
    pagination({
      message: interaction,
      embeds,
      pageTravel: true,
      fastSkip: true,
    });
  }
}
function generateQueueEmbed(queue: Queue, currentPlaying: Song) {
  const embeds = [];
  let k = 5;
  for (let i = 0; i < queue.songs.length; i += 5) {
    const current = queue.songs.slice(i, k);
    let j = i;
    k += 5;
    let info = "";
    current.forEach((track) => {
      info = `${info}\n\`\`\`css\n${++j}) ${track.name}🎵 || By: ${
        track.user?.tag || "Unkown Requester"
      }\`\`\``;
    });

    const embed = new MessageEmbed().setDescription(
      `Current Song:\n \`\`\`${currentPlaying.name}🎵\`\`\`\n\n${info}`
    );
    embeds.push(embed);
  }
  return embeds;
}
