import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";
import getFlags from "../../utils/constants/getFlags";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "badges",
      category: "utility",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);
    if (!message?.guild || !message?.member) return;
    const member = await getMember({
      message,
      query: args.join(" "),
      returnAuthor: true,
    });
    const flags = member?.user?.flags;
    if (flags && flags.toArray()[0]) {
      const embed = new MessageEmbed().setDescription(getFlags(flags));
      message?.channel?.send({ embeds: [embed] });
    } else {
      message?.channel?.send({
        content: GetLanguage("MemberHasNoBadges", config.language),
      });
    }
  }
}
