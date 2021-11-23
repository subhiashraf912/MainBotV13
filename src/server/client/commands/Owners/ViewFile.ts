import { Message, MessageEmbed, TextChannel, User } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getDevelopers from "../../utils/constants/GetDevelopers";
import { promises as fs } from "fs";
import pagination from "../../utils/constants/pagination";
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "view-file",
      category: "owner",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const file = await (await readFiles(args[0])).toString();
    const length = file.length;
    const texts = [];
    const parts = length / 2000;
    for (let i = 0; i < parts; i++) {
      texts.push(file.substring(i * 2000, (i + 1) * 2000));
    }

    const developer = await getDevelopers({ client });

    const embeds = generateFilesEmbed(texts, developer);
    pagination({
      message,
      embeds,
      fastSkip: true,
      pageTravel: true,
    });
  }
}

async function readFiles(dir: string = "") {
  return fs.readFile(dir).catch((err) => {
    return err;
  });
}

function generateFilesEmbed(texts: string[], developer: User) {
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
        `Developer: ${developer.tag}`,
        developer.displayAvatarURL({
          dynamic: true,
          size: 4096,
        })
      );
    embeds.push(embed);
  }
  return embeds;
}
