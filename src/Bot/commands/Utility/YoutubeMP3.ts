import { Message, MessageAttachment } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import fs from "fs";
import DisTube from "distube";
import ytdl from "discord-ytdl-core";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "yt-mp3",
      category: "utility",
      aliases: [],
      userPermissions: [],
      botPermissions: ["ATTACH_FILES"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);

    if (!args || !args[0]) {
      message.reply({
        content: GetLanguage("MemberNeedsToEnterYoutubeLink", config.language),
      });
      return;
    }
    const fileName = `${Date.now()}-${message.author.id}`;
    message.channel.send({
      content: GetLanguage("SearchingForData", config.language),
    });

    const song = await searchSong(args.join(" "), client.distube as DisTube);
    if (!song) {
      message.channel.send({
        content: GetLanguage("SongNotFound", config.language),
      });
      return;
    }
    if (!ytdl.validateURL(song.url)) {
      message.channel.send({
        content: GetLanguage("LinkShouldBeYoutubeLink", config.language),
      });
      return;
    }
    const ytdlObj = ytdl(song?.url, {
      quality: "highestaudio",
      filter: "audioonly",
    });
    const stream = ytdlObj
      .pipe(fs.createWriteStream(fileName))
      .on("finish", async () => {
        const attachment = new MessageAttachment(
          `./${fileName}`,
          `${song.name}.mp3`
        );
        await message.channel
          .send({
            content: GetLanguage("DoneDownloadingSong", config.language),
            files: [attachment],
          })
          .catch((err) => message.channel.send(err.message));
        try {
          fs.unlinkSync(`./${fileName}`);
        } catch (err: any) {
          message.channel.send(err.message);
        }
      });
  }
}

const searchSong = async (query: string, distube: DisTube) => {
  const limit = 1;
  const results = await distube
    .search(query, {
      limit,
      safeSearch: true,
    })
    .catch(() => undefined);
  if (!results?.length) {
    return null;
  }
  let result = results[0];
  return result;
};
