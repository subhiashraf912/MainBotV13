import { Message, MessageEmbed, TextChannel, User } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getDevelopers from "../../utils/constants/GetDevelopers";
import { promises as fs } from "fs";
import pagination from "../../utils/constants/pagination";
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "list-files",
      category: "owner",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const files = (await listFiles(args.join(" "))).map(
      (file: any) => `${file}\n`
    );
    const length = files.length;
    const texts = [];
    const parts = length / 2000;
    const developer = await getDevelopers({
      client,
    });
    for (let i = 0; i < parts; i++) {
      texts.push(files.substring(i * 2000, (i + 1) * 2000));
    }
    const embeds = generateFilesEmbed(texts, developer);
    pagination({
      message,
      embeds,
      fastSkip: true,
      pageTravel: true,
    });
  }
}

async function listFiles(dir: string = "") {
  const files = await fs.readdir(dir).catch((err) => {
    return err;
  });
  return files;
}

function generateFilesEmbed(texts: string[], developer: User) {
  const embeds = [];
  let k = 15;
  for (let i = 0; i < texts.length; i += 15) {
    const r = texts.slice(i, k);
    let j = i;
    k += 15;
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
