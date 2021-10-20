import { Message, MessageAttachment } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import { RankBackgroundSchema } from "../../utils/MongoDB/Models";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "rank-background",
      category: "levels",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member) return;
    const config = await getConfig(client, message.guild?.id as string);
    const dev = await client.users.fetch("849641637831376936");
    let current = client.rankBackgrounds.get(message.author.id);
    if (args[0] === "default") {
      if (current && current.rankBackground) {
        const data: any = await RankBackgroundSchema.findOneAndUpdate(
          { user: message.author.id },
          { $set: { rankBackground: null } },
          { new: true }
        );
        client.rankBackgrounds.set(message.author.id, data);
        {
          message.reply({
            content: GetLanguage(
              "RankBackgroundHasBeenUpdated",
              config.language
            ),
          });
          return;
        }
      }
    }

    let attachment = message.attachments.first();
    if (!attachment) {
      message.reply({
        content: GetLanguage(
          "MemberNeedsToSendTheBackgroundWithTheMessage",
          config.language
        ),
      });
      return;
    }
    let botAttachment = new MessageAttachment(attachment.url);
    if (botAttachment.size >= 8192000) {
      message.reply({
        content: GetLanguage("AttachmentShouldBeLessThan8MB", config.language),
      });
      return;
    }
    let channel: any = client.channels.cache.find(
      (ch) => ch.id == "813124926248714261"
    );
    let m: Message;
    if (channel && channel.type === "text")
      m = await channel.send(
        `by: ${message.member} | ${message.author.id} | ${message.author.tag}`,
        botAttachment.attachment
      );
    else
      m = await dev.send({
        content: `by: ${message.member} | ${message.author.id} | ${message.author.tag}`,
        files: [botAttachment.attachment],
      });
    let data;
    if (!current) {
      data = await RankBackgroundSchema.findOne({
        user: message.author.id,
      });
      if (!data)
        data = await RankBackgroundSchema.create({
          user: message.author.id,
        });
    }

    data = await RankBackgroundSchema.findOneAndUpdate(
      { user: message.author.id },
      {
        $set: {
          rankBackground: m.attachments.first()?.attachment,
        },
      },
      { new: true }
    );
    client.rankBackgrounds.set(message.author.id, data as any);
    await message.reply({
      content: GetLanguage("RankBackgroundHasBeenUpdated", config.language),
    });
  }
}
