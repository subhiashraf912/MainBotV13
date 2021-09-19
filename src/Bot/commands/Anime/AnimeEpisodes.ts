import { Message, MessageEmbed, TextChannel } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import pagination from "../../utils/constants/pagination";
const mal = require("mal-scraper");
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "anime-episodes",
      category: "anime",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const anime = await mal.getInfoFromName(args.join(" "));
    const episodes = await mal.getEpisodesList({
      name: anime.title,
      id: anime.id,
    });

    const embeds = GenerateEpisodesEmbed(episodes, anime);
    pagination({
      author: message.author,
      channel: message.channel as TextChannel,
      fastSkip: true,
      embeds,
      pageTravel: true,
    });
  }
}

function GenerateEpisodesEmbed(episodes: Array<any>, anime: any) {
  const embeds = [];
  let k = 5;
  for (let i = 0; i < episodes.length; i += 5) {
    const current = episodes.slice(i, k);
    let j = i;
    k += 5;
    const info = current
      .map(
        (ep) =>
          `**Episode ${++j}:\n**\`Name: ${ep.title}\`\n\`Japanese name: ${
            ep.japaneseTitle
          }\`\n\`Aired: ${ep.aired}\``
      )
      .join(`\n`);
    const embed = new MessageEmbed()
      .setTitle(`${anime.title} episodes list`)
      .setDescription(`${info}`)
      .setThumbnail(anime.picture)
      .setFooter(`Data from MyAnimeList.net`);
    embeds.push(embed);
  }
  return embeds;
}
