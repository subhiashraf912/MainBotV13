import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";

export default class PingCommand extends BaseCommand {
  constructor() {
    super({
      name: "ping",
      category: "utility",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);

    const embed = new MessageEmbed().setDescription(
      `\`\`\`${GetLanguage("Latency", config.language)}: ${
        ((Date.now() - message.createdTimestamp) / 3).toString().split(".")[0]
      }\`\`\`\n\`\`\`${GetLanguage("APILatency", config.language)}: ${
        (client.ws.ping / 3).toString().split(".")[0]
      }\`\`\``
    );
    message.reply({ embeds: [embed] });
  }
}
