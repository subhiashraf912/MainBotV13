import { Message, TextChannel } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getChannel from "../../utils/constants/getChannel";
import ms from "ms";
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "start-giveaway",
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
    const channel = getChannel({
      message,
      query: args[0],
    });

    if (!channel) {
      message.reply(GetLanguage("NoGiveawayChannelFound", config.language));
      return;
    }

    if (!args[1]) {
      message.reply(GetLanguage("GiveawayTimeIsMissing", config.language));
      return;
    }
    if (!args[2]) {
      message.reply({
        content: GetLanguage("GiveawayWinnerCountIsMissing", config.language),
      });
      return;
    }
    if (!args[3]) {
      message.reply(GetLanguage("GiveawayPrizeIsMissing", config.language));
      return;
    }
    if (channel.type !== "GUILD_TEXT") {
      message.reply({
        content: GetLanguage("TextChannelRequired", config.language),
      });
      return;
    }
    const giveaway = await client.giveawaysManager.start(
      channel as TextChannel,
      {
        duration: ms(args[1]),
        winnerCount: parseInt(args[2], 10),
        prize: args.slice(3).join(" "),
        messages: {
          giveaway: GetLanguage("GiveawayTitle", config.language),
          giveawayEnded: GetLanguage("GiveawayEnded", config.language),
          timeRemaining: GetLanguage("GiveawayRemainingTime", config.language),
          inviteToParticipate: GetLanguage(
            "GiveawayReactMessage",
            config.language
          ),
          winMessage: GetLanguage("GiveawayWinMessage", config.language),
          embedFooter: GetLanguage(
            "GiveawayEmbedFooter",
            config.language
          ).replaceAll("{clientUsername}", client.user?.username as string),
          noWinner: GetLanguage("GiveawayCanceled", config.language),
          hostedBy: GetLanguage("GiveawayHostedBy", config.language),
          winners: GetLanguage("Winners", config.language),
          endedAt: GetLanguage("EndedAt", config.language),
        },
      }
    );

    message.reply(
      GetLanguage("GiveawayStarted", config.language)
        .replaceAll("{channel}", channel.toString())
        .replaceAll("{remainingTime}", giveaway.remainingTime.toString())
        .replaceAll("{winnersCount}", giveaway.winnerCount.toString())
        .replaceAll("{prize}", giveaway.prize)
    );
  }
}
