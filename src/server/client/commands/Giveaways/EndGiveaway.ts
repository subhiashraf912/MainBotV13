import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "end-giveaway",
      category: "giveaways",
      aliases: [],
      userPermissions: ["MANAGE_GUILD"],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member || !client.giveawaysManager) return;
    const messageID = args[0];
    const config = await getConfig(client, message.guild.id);
    if (!messageID) {
      message.reply({
        content: GetLanguage("GiveawayMessageIDIsRequired", config.language),
      });
      return;
    }
    client.giveawaysManager
      .end(messageID)
      .then(() => {
        message.reply(GetLanguage("GiveawayEnded", config.language));
      })
      .catch((err) => {
        message.reply(
          GetLanguage("NoGiveawayWasFound", config.language).replaceAll(
            "{messageId}",
            messageID
          )
        );
      });
  }
}
