import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "clear",
      category: "moderation",
      aliases: ["purge"],
      userPermissions: ["MANAGE_MESSAGES"],
      botPermissions: ["MANAGE_MESSAGES"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild) return;
    if (!message.member) return;
    const config = await getConfig(client, message.guild.id);
    const language = config.language;
    let clearAmount: number = parseInt(args[0]);

    if (!clearAmount) clearAmount = 100;
    if (isNaN(clearAmount)) {
      message.reply({
        content: GetLanguage("ClearAmountMustBeANumber", language),
      });
      return;
    }
    if (clearAmount < 0) {
      message.reply({
        content: GetLanguage("ClearAmountMustBeMoreThanZero", language),
      });
      return;
    }
    if (clearAmount > 100) {
      message.reply({
        content: GetLanguage("ClearAmountMustBeLessThan100", language),
      });
      return;
    }
    if (message.channel.type === "GUILD_TEXT") {
      message.channel.bulkDelete(clearAmount, true);
    } else {
      message.reply({
        content: GetLanguage("ClearChannelMustBeATextChannel", language),
      });
      return;
    }

    message.channel
      .send(
        GetLanguage("BotHasDoneClearingMessages", language).replace(
          "{messages}",
          clearAmount.toString()
        )
      )
      .then((msg) => {
        setTimeout(async () => {
          await msg.delete();
        }, 5000);
      });
  }
}
