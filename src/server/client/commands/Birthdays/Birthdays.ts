import { Guild, Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import { BirthdaysSchema } from "../../utils/MongoDB/Models";
import BirthdayType from "../../../../types/BirthdayType";
import pagination from "../../utils/constants/pagination";
import { GetBirthday } from "../../utils/constants/Functions";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "birthdays",
      category: "birthdays",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member) return;
    const config = await getConfig(client, message.guild.id);

    let msg = await message.reply({
      content: GetLanguage("GettingBirthdays", config.language),
    });
    const birthdays: any = await BirthdaysSchema.find();
    const bdMembers: BirthdayType[] = [];

    birthdays.forEach((bd: BirthdayType) => {
      const member = message.guild?.members.cache.get(bd.user);
      if (member) bdMembers.push(bd);
    });

    function compare(a: BirthdayType, b: BirthdayType) {
      // Use toUpperCase() to ignore character casing
      const aArgs = a.birthday.split("-");
      const bArgs = b.birthday.split("-");

      const aDay = parseInt(aArgs[0]);
      const bDay = parseInt(bArgs[0]);
      const aMonth = parseInt(aArgs[1]);
      const bMonth = parseInt(bArgs[1]);
      let comparison = 0;

      if (aDay < bDay) comparison = -1;
      if (aDay > bDay) comparison = 1;
      if (aMonth < bMonth) comparison = -1;
      if (bMonth > bMonth) comparison = +1;

      return comparison;
    }

    bdMembers.sort(compare);
    const embeds = await GenerateEmbeds(client, bdMembers, message.guild);
    pagination({
      message,
      embeds,
      fastSkip: true,
      pageTravel: true,
    });
  }
}

async function GenerateEmbeds(
  client: DiscordClient,
  birthdays: Array<BirthdayType>,
  guild: Guild
) {
  const embeds = [];
  let k = 10;
  let x = 0;
  let aze = client.users.cache.get("849641637831376936");
  for (let i = 0; i < birthdays.length; i += 10) {
    const current = birthdays.slice(i, k);
    let j = i;
    k += 5;
    const icon: string = guild.iconURL({ dynamic: true, size: 4096 }) || "";
    const embed = new MessageEmbed()
      .setTitle(`${guild.name} birthdays list`)
      .setAuthor(guild.name, icon)
      .setColor("BLUE")
      .setFooter(
        `Developer: ${aze?.tag}`,
        aze?.displayAvatarURL({ dynamic: true, size: 4096 })
      );
    current.forEach(async (element) => {
      let member = await client.users.fetch(element.user);
      if (member) {
        embed.addField(member.tag, `● ${GetBirthday(element.birthday)}`);
      }
      x = x + 1;
    });

    embeds.push(embed);
  }
  return embeds;
}
