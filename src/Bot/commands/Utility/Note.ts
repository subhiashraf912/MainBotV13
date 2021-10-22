import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "note",
      category: "utility",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);

    let Attachment = message.attachments.first();

    if (!Attachment) {
      message.author
        .send({
          content: `✪══════════════✪✪══════════════✪\n**You took a note:**\n\n**in server:**\`${
            message.guild?.name
          }\`\n\n**in channel:**\n**${
            message.channel
          }**\n✪══════════════✪✪══════════════✪\n\n**Your note:**\n${args.join(
            " "
          )}\n✪══════════════✪✪══════════════✪`,
        })
        .then(() => {
          message.reply({
            content: GetLanguage("NoteHasBeenSentToDMS", config.language),
          });
        })
        .catch((err) => {
          message.reply(err.message);
        });
      return;
    }
    if (Attachment) {
      message.author
        .send({
          content: `✪══════════════✪✪══════════════✪\n**You took a note:**\n\n**in server:**\`${
            message.guild?.name
          }\`\n\n**in channel:**\n**${
            message.channel
          }**\n✪══════════════✪✪══════════════✪\n\n**Your note:**\n${args.join(
            " "
          )}\n✪══════════════✪✪══════════════✪`,
          files: [Attachment],
        })
        .then(() => {
          message.reply(`You took a note! it has been sent to your dm`);
        })
        .catch((err) => {
          message.reply(err.message);
        });
      return;
    }
  }
}
