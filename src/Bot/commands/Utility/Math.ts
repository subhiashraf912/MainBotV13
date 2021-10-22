import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import math from "mathjs";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "calculator",
      category: "utility",
      aliases: ["math", "cal"],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);
    if (!args[0]) {
      message.reply({
        content: GetLanguage("MemberNeedsToProvideAQuestion", config.language),
      });
      return;
    }
    let res;

    try {
      res = math.evaluate(args.join(" "));
    } catch (e) {
      console.log(e);
      {
        message.reply({
          content: GetLanguage(
            "MemberNeedsToProvideAValidQuestion",
            config.language
          ),
        });
        return;
      }
    }

    const embed = new MessageEmbed()
      .setColor(0x808080)
      .setTitle(GetLanguage("Calculator", config.language))
      .addField(
        GetLanguage("Question", config.language),
        `\`\`\`css\n${args.join(` `)}\`\`\``
      )
      .addField(
        GetLanguage("Answer", config.language),
        `\`\`\`css\n${res}\`\`\``
      );

    message.reply({ embeds: [embed] });
  }
}
