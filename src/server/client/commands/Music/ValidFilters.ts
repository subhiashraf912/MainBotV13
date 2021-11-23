import { Message, MessageEmbed, User } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import pagination from "../../utils/constants/pagination";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "valid-filters",
      category: "music",
      aliases: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    let filters = "";
    for (const filter of Object.keys(client.distube.filters)) {
      filters = `${filters}\n${filter}`;
    }
    const length = filters.length;
    const texts = [];
    const parts = length / 2000;
    for (let i = 0; i < parts; i++) {
      texts.push(filters.substring(i * 2000, (i + 1) * 2000));
    }
    const embeds = generateEmbeds(
      Object.keys(client.distube.filters),
      message.author
    );
    pagination({
      message,
      embeds,
      pageTravel: true,
      fastSkip: true,
    });
  }
}

function generateEmbeds(texts: string[], author: User): MessageEmbed[] {
  const embeds = [];
  let k = 1;
  for (let i = 0; i < texts.length; i += 1) {
    const r = texts.slice(i, k);
    let j = i;
    k += 1;
    let info = "";
    r.forEach((text) => {
      info = `${info}\n${text}`;
    });

    const embed = new MessageEmbed()
      .setDescription(
        `\`\`\`ts\n
        ${info}
        \`\`\``
      )
      .setFooter(
        `Requested by: ${author.tag}`,
        author.displayAvatarURL({
          dynamic: true,
          size: 4096,
        })
      );
    embeds.push(embed);
  }
  return embeds;
}
