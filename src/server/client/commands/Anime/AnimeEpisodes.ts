import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
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
    const config = await getConfig(client, message.guild?.id as string);
    const episodes = await mal.getEpisodesList({
      name: anime.title,
      id: anime.id,
    });

    const embeds = GenerateEpisodesEmbed(episodes, anime, config.language);
    pagination({
      message,
      fastSkip: true,
      embeds,
      pageTravel: true,
    });
  }
}

function GenerateEpisodesEmbed(
  episodes: Array<any>,
  anime: any,
  language: string
) {
  const embeds = [];
  let k = 5;
  for (let i = 0; i < episodes.length; i += 5) {
    const current = episodes.slice(i, k);
    let j = i;
    k += 5;
    const info = current
      .map(
        (ep) =>
          `**${GetLanguage("Episode", language)} ${++j}:\n**\`${GetLanguage(
            "Name",
            language
          )}: ${ep.title}\`\n\`${GetLanguage("JapaneseName", language)}: ${
            ep.japaneseTitle
          }\`\n\`${GetLanguage("Aired", language)}: ${ep.aired}\``
      )
      .join(`\n`);
    const embed = new MessageEmbed()
      .setTitle(
        `${GetLanguage("EpisodesListTitle", language).replaceAll(
          "{animeName}",
          anime.title
        )}`
      )
      .setDescription(`${info}`)
      .setThumbnail(anime.picture)
      .setFooter(GetLanguage("DataFromAnimeList", language));
    embeds.push(embed);
  }
  return embeds;
}
