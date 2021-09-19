import { Message, MessageEmbed, TextChannel, User } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import Genius from "genius-lyrics";
import pagination from "../../utils/constants/pagination";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
const lyricsFinder = new Genius.Client();
export default class LyricsCommand extends BaseCommand {
  constructor() {
    super({
      name: "lyrics",
      category: "music",
      aliases: ["ly"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);

    if (!args[0]) {
      message.reply({
        content: GetLanguage("ArgumentsAreMissing", config.language),
      });
      return;
    }

    let lyrics = null;
    try {
      const searches = await lyricsFinder.songs.search(args.join(" "));
      const firstSong = searches[0];
      lyrics = await firstSong.lyrics();
    } catch (error) {
      lyrics = GetLanguage("NoLyricsFound", config.language).replace(
        "{arguments}",
        args.join(" ")
      );
    }

    const length = lyrics.length;
    const texts = [];
    const parts = length / 2000;
    for (let i = 0; i < parts; i++) {
      texts.push(lyrics.substring(i * 2000, (i + 1) * 2000));
    }

    const embeds = generateFilesEmbed(texts, message.author, config.language);
    pagination({
      author: message.author,
      channel: message.channel as TextChannel,
      embeds,
      pageTravel: true,
      fastSkip: true,
    });
  }
}

function generateFilesEmbed(
  texts: string[],
  author: User,
  language: string
): MessageEmbed[] {
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
      .setTitle(GetLanguage("Lyrics", language))
      .setDescription(
        `\`\`\`ts\n
        ${info}
        \`\`\``
      )
      .setFooter(
        GetLanguage("RequestedBy", language).replace("{user}", author.tag),
        author.displayAvatarURL({
          dynamic: true,
          size: 4096,
        })
      );
    embeds.push(embed);
  }
  return embeds;
}
