import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "disable-auto-translate",
      category: "utility",
      aliases: [],
      userPermissions: ["MANAGE_GUILD"],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member) return;
    client.autoTranslate.delete(message.channel.id);
    message.reply("done");
  }
}
