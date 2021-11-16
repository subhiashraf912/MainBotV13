import BaseEvent from "../../utils/structures/BaseEvent";
import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import translate from "@vitalets/google-translate-api";

export default class MessageEvent extends BaseEvent {
  constructor() {
    super("messageCreate");
  }

  async run(client: DiscordClient, message: Message) {
    if (message.author.bot) return;
    if (client.autoTranslate.get(message.channel.id)) {
      let TextToBeTranslated = message.content;
      let language = "en";

      try {
        const res = await translate(TextToBeTranslated, {
          to: language,
        });
        if (res.from.language.iso === language) return;
        let embed = new MessageEmbed()
          .setDescription(res.text)
          .setColor("RANDOM")
          .setFooter(
            `Translated from: ${res.from.language.iso} To: ${language}`
          );
        message.reply({ embeds: [embed] });
      } catch (err: any) {}
    }
  }
}
