import { Message, MessageEmbed, TextChannel } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { Song } from "distube";
import { Queue } from "distube";
import pagination from "../../utils/constants/pagination";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
export default class QueueCommand extends BaseCommand {
  constructor() {
    super({
      name: "queue",
      category: "music",
      aliases: ["q"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.member || !message.guild || !message.guild.me) return;
    const config = await getConfig(client, message.guild?.id as string);
    if (!message.member?.voice.channel) {
      message.reply({
        content: GetLanguage("MemberNeedsToBeInAVoiceChannel", config.language),
      });
      return;
    }

    if (
      message.guild?.me?.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    ) {
      message.reply({
        content: GetLanguage(
          "MemberNeedsToBeInTheSameVoiceChannelAsTheBot",
          config.language
        ),
      });
      return;
    }
    const queue = client.distube.getQueue(message);
    if (!queue) {
      message.reply({
        content: GetLanguage("NoQueue", config.language),
      });
      return;
    }
    queue.currentTime;

    const current = queue.songs[0];
    const embeds = generateQueueEmbed(queue, current, config.language);
    pagination({
      author: message.author,
      channel: message.channel as TextChannel,
      embeds,
      pageTravel: true,
      fastSkip: true,
    });
  }
}
function generateQueueEmbed(
  queue: Queue,
  currentPlaying: Song,
  language: string
) {
  const embeds = [];
  let k = 5;
  for (let i = 0; i < queue.songs.length; i += 5) {
    const current = queue.songs.slice(i, k);
    let j = i;
    k += 5;
    let info = "";
    current.forEach((track) => {
      info = `${info}\n\`\`\`css\n${++j}) ${track.name}🎵 || ${GetLanguage(
        "By",
        language
      )}: ${track.user?.tag || GetLanguage("UnkownRequester", language)}\`\`\``;
    });

    const embed = new MessageEmbed().setDescription(
      `${GetLanguage("CurrentSong", language)}:\n \`\`\`${
        currentPlaying.name
      }🎵\`\`\`\n\n${info}`
    );
    embeds.push(embed);
  }
  return embeds;
}
