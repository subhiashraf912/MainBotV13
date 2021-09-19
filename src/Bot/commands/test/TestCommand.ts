import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import GetLanguage from "../../utils/Languages";
import getConfig from "../../utils/constants/getConfig";

export default class TestCommand extends BaseCommand {
  constructor() {
    super({ name: "test", category: "test" });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    message.reply({
      content: GetLanguage(
        "TheTestCommandWorks",
        (await getConfig(client, message.guild?.id as string)).language
      ),
    });
  }
}
