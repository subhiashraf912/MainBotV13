import { Message, MessageEmbed, User } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getDevelopers from "../../utils/constants/GetDevelopers";
import pagination from "../../utils/constants/pagination";
const GenshinImpact = require("genshin-db");

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "genshin-talent",
      category: "genshin impact",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const talent = GenshinImpact.talents(args.join(" "));
    const config = await getConfig(client, message.guild?.id as string);
    if (!talent) {
      message.reply({
        content: GetLanguage("TalentNotFound", config.language),
      });
      return;
    }
    const combats = [];
    if (talent.combat1) combats.push(talent.combat1);
    if (talent.combat2) combats.push(talent.combat2);
    if (talent.combat3) combats.push(talent.combat3);
    if (talent.combat4) combats.push(talent.combat4);
    if (talent.combat5) combats.push(talent.combat5);
    const developer = await getDevelopers({ client });
    const embeds = generateTalentsEmbed(
      combats,
      developer,
      args,
      config.language
    );
    pagination({
      message,
      embeds,
      fastSkip: true,
      pageTravel: true,
    });
  }
}

function generateTalentsEmbed(
  combats: any[],
  developer: User,
  args: Array<string>,
  language: string
) {
  const embeds: MessageEmbed[] = [];
  let k = 10;
  for (let i = 0; i < combats.length; i += 10) {
    const c = combats.slice(i, k);
    k += 10;
    let info = "";
    c.forEach((combat) => {
      let attributes = "";
      combat.attributes.labels.forEach((element: string) => {
        attributes = `${attributes}\n${element.split("|")[0]}`;
      });
      info = `${info}\n\`\`\`${GetLanguage("Name", language)}: ${
        combat.name
      }\`\`\`\`\`\`${GetLanguage("Info", language)}:\`\`\`${
        combat.info
      }\`\`\`${GetLanguage("Attributes", language)}:\`\`\`${attributes}`;

      const talent = GenshinImpact.talents(args.join(" "));

      const embed = new MessageEmbed()
        .setDescription(info)
        .setThumbnail(talent.images.card)
        .setImage(talent.images.cover1)
        .setFooter(
          `${GetLanguage("Developer", language)}: ${developer.tag}`,
          developer.displayAvatarURL({ dynamic: true })
        );
      embeds.push(embed);
    });
  }
  return embeds;
}
