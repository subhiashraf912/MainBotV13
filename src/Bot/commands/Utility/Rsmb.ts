import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import { download } from "../../utils/constants/Functions";
ffmpeg.setFfmpegPath(ffmpegPath);
//@ts-ignore
const { upload } = require("wetransfert");

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "rsmb",
      category: "utility",
      aliases: [],
      userPermissions: ["ATTACH_FILES"],
      botPermissions: ["ATTACH_FILES"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member) return;
    if (client.rendering) {
      message.reply(
        "I can't render now because there's someone else rendering. Please come back later when the queue is free..."
      );
      return;
    }
    client.setRendering();
    const attachment = message.attachments.first();
    if (!attachment) {
      message.reply(
        "You need to send the video in your message as an attachment"
      );
          client.setRendering();

      return;
    }
    const rsmbAmountString = args[0] || "2";
    const rsmbAmount = parseInt(rsmbAmountString);
    if (rsmbAmount > 10 || !(rsmbAmount > 1)) {
      message.reply("You can only choose the value from above 1 to 10, ");
          client.setRendering();

      return;
    }
    const downloading = download(attachment);
    const msg = await message.reply("Downloading your video, please wait...");
    downloading.on("close", async () => {
      await msg.edit(
        "Done downloading the video, Adding rsmb to your video..."
      );
      const command = ffmpeg("Rsmb.mp4");
      command.videoFilter(
        `tmix=frames=${rsmbAmountString}:weights="1 1 1 1 1 1 1 1"`
      );
      command.output("output.mp4");
      command.size("100%");
      command.videoCodec("libx264");
      command.videoBitrate(16000);
      command.on("progress", async (progress) => {
        await msg.edit(
          `In progress...\n> rendered frames:${progress.frames.toString()}\n> Current time: ${
            progress.timemark
          }`
        );
      });
      command.on("end", async () => {
        await msg.edit(
          "Added rsmb to your video, uploading your video now...."
        );
        upload("", "", "output.mp4", attachment.name || "Your edit", "en")
          .on("end", async (end: any) => {
            await msg.edit({
              content: `Here's your edit:\nYou can use the link for same quality\n${end.shortened_url}`,
            });
            try {
              client.setNotRendering();
              fs.unlinkSync(`output.mp4`);
              fs.unlinkSync(`Rsmb.mp4`);
            } catch {
              client.setNotRendering();
            }
          })
          .on("error", (error: any) => {
            client.setNotRendering();

            msg.edit(`Error happened while uploading: ${error.message}`);
          });
      });
      command.on("error", (err) => {
        client.setNotRendering();

        msg.edit(
          `Error happened while adding rsmb to your video: ${err.message}`
        );
      });
      command.run();
    });
  }
}
