import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "delete-giveaway",
      category: "giveaways",
      aliases: [],
      userPermissions: ["MANAGE_GUILD"],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member) return;
    const messageID = args[0];
    const config = await getConfig(client, message.guild.id);

    if (!messageID) {
      message.reply({
        content: GetLanguage("GiveawayMessageIDIsRequired", config.language),
      });
      return;
    }
    client.giveawaysManager
      .delete(messageID)
      .then(() => {
        message.reply({
          content: GetLanguage("GiveawayDeleted", config.language),
        });
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
