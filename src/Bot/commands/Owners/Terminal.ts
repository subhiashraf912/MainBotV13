import { Message, MessageEmbed, TextChannel, User } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import child from "child_process";
import pagination from "../../utils/constants/pagination";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "terminal",
      category: "owner",
      aliases: ["shell"],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!args[0]) {
      message.channel.send({
        content: "Cannot find arguments!",
      });
      return;
    }
    const command = args.join(" ");
    const msg = await message.channel.send(`Running the command ${command}`);

    child.exec(command, (err, output) => {
      if (err) return console.log(err);

      const length = output.length;
      const texts = [];
      const parts = length / 2000;
      for (let i = 0; i < parts; i++) {
        texts.push(output.substring(i * 2000, (i + 1) * 2000));
      }

      const embeds = generateFilesEmbed(texts, message.author);
      pagination({
        message,
        embeds,
        pageTravel: true,
        fastSkip: true,
      });
    });
  }
}

function generateFilesEmbed(texts: string[], author: User): MessageEmbed[] {
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
