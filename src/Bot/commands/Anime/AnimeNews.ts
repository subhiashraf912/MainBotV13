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
      name: "anime-news",
      category: "anime",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    let news = await mal.getNewsNoDetails(50);
    const config = await getConfig(client, message.guild?.id as string);
    const embeds = GenerateNewsEmbed(news, 2, config.language);

    pagination({
      author: message.author,
      channel: message.channel as TextChannel,
      fastSkip: true,
      embeds,
      pageTravel: true,
    });
  }
}

function GenerateNewsEmbed(news: Array<any>, max: number, language: string) {
  const embeds = [];
  let k = max;
  for (let i = 0; i < news.length; i += max) {
    const current = news.slice(i, k);
    let j = i;
    k += max;
    const image = current[0].image;
    const info = current
      .map(
        (element) =>
          `**${++j}: [${element.title}](${element.link})**\n**\`${
            element.text
          }\`**`
      )
      .join(`\n`);
    const embed = new MessageEmbed()
      .setTitle(GetLanguage("LatestAnimeNews", language))
      .setDescription(`${info}`)
      .setThumbnail(image)
      .setFooter(GetLanguage("DataFromAnimeList", language));
    embeds.push(embed);
  }
  return embeds;
}
