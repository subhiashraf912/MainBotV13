import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "reroll-giveaway",
      category: "giveaways",
      aliases: [],
      userPermissions: ["MANAGE_GUILD"],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member || !client.giveawaysManager) return;
    const config = await getConfig(client, message.guild.id);

    const messageID = args[0];
    if (!messageID) {
      message.reply(
        GetLanguage("GiveawayMessageIDIsRequired", config.language)
      );
      return;
    }
    client.giveawaysManager
      .reroll(messageID)
      .then(() => {
        message.reply(GetLanguage("GiveawayRerolled", config.language));
      })
      .catch((err) => {
        message.reply({
          content: GetLanguage(
            "NoGiveawayWasFound",
            config.language
          ).replaceAll("{messageId}", messageID),
        });
      });
  }
}
