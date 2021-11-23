import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import GenerateGif from "../../utils/constants/Gifs/GetGif";
import getDevelopers from "../../utils/constants/GetDevelopers";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "neko",
      category: "anime",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member) return;
    const gif = GenerateGif("nekoPics");
    const config = await getConfig(client, message.guild?.id);
    const developer = await getDevelopers({ client });
    if (!gif) {
      message.reply({
        content: GetLanguage("ErrorOccured", config.language),
      });
      return;
    }
    const embed = new MessageEmbed()
      .setAuthor(
        message.author.username,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription(`\`\`\`${message.author.username}'s neko\`\`\``)
      .setImage(gif)
      .setColor("BLUE")
      .setFooter(
        `${GetLanguage("Developer", config.language)}: ${developer.tag}`,
        developer.displayAvatarURL({ dynamic: true })
      );
    message.reply({ embeds: [embed] });
  }
}
