import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import translate from "@vitalets/google-translate-api";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "translate",
      category: "utility",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);
    if (!args[0]) {
      message.reply({
        content: GetLanguage(
          "MemberNeedsToEnterATextToTranslate",
          config.language
        ),
      });
      return;
    }

    let AllMessageObj = args.join(" ").split("-");
    let TextToBeTranslated = AllMessageObj[0];
    let language;

    if (AllMessageObj[1]) language = AllMessageObj[1];
    else {
      language = "en";
    }

    try {
      const res = await translate(TextToBeTranslated, {
        to: language,
      });
      let embed = new MessageEmbed()
        .setDescription(res.text)
        .setColor("RANDOM")
        .setFooter(
          `${GetLanguage("TranslatedFrom", config.language)}: ${
            res.from.language.iso
          }  ${GetLanguage("To", config.language)}:${language}`
        );
      message.reply({ embeds: [embed] });
    } catch (err: any) {
      {
        message.reply(err.message);
        return;
      }
    }
  }
}
