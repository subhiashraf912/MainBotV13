import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getUser from "../../utils/constants/getUser";
import getDevelopers from "../../utils/constants/GetDevelopers";
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "banner",
      category: "utility",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member) return;
    const config = await getConfig(client, message.guild?.id as string);

    const language = config.language;

    const developer = await getDevelopers({ client });
    const target =
      (await getUser({
        message,
        query: args.join(" "),
      })) || message.author;
    await target.fetch();
    const banner = target.bannerURL({ dynamic: true, size: 4096 });
    if (!banner) {
      message.reply(GetLanguage("MemberDoesNotHaveBanner", language));
      return;
    }
    const embed = new MessageEmbed()
      .setDescription(
        `\`\`\`${GetLanguage("RequestedBy", language)}: ${
          message.author.tag
        }\`\`\``
      )
      .setImage(banner)
      .setFooter(
        `${GetLanguage("Developer", language)}: ${developer.tag}`,
        developer.displayAvatarURL({ dynamic: true, size: 4096 })
      );
    message.reply({ embeds: [embed] });
  }
}
