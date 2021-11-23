import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import { RankSchema } from "../../utils/MongoDB/Models";
import getUser from "../../utils/constants/getUser";
import getGuild from "../../utils/constants/getGuild";
import RankType from "../../../../types/RankType";
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "cache-rank",
      category: "owner",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild) return;
    const config = await getConfig(client, message.guild.id);
    const user = await getUser({ query: args[0], message });
    const server = getGuild({ query: args[1], message });
    if (!user || !server) {
      message.reply({
        content: GetLanguage("UserNotFound", config.language),
      });
      return;
    }
    const Rank: any = await RankSchema.findOne({
      user: user.id,
      server: server.id,
    });
    if (!Rank) {
      message.reply({
        content: GetLanguage("NoDataWereFoundInTheDatabase", config.language),
      });
      return;
    }
    client.ranks.set(`${user}-${server}`, Rank as RankType);
    message.reply({
      content: GetLanguage("RankGotCached", config.language),
    });
  }
}
