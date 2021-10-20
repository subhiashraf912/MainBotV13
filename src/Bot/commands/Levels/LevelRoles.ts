import {
  GuildChannel,
  Message,
  MessageEmbed,
  TextChannel,
  User,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import pagination from "../../utils/constants/pagination";
import getDevelopers from "../../utils/constants/GetDevelopers";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "level-roles",
      category: "levels",
      aliases: [],
      userPermissions: ["MANAGE_GUILD"],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const cachedConfig = await getConfig(client, message.guild?.id as string);
    const levelRoles = cachedConfig.levelRoles;
    if (!levelRoles) {
      message.reply(
        GetLanguage("NoLevelRolesWereFound", cachedConfig.language)
      );
      return;
    }

    const RolesObject: `${string}:${string}`[] = [];

    for (const [key, value] of Object.entries(levelRoles)) {
      let role = message.guild?.roles.cache.find((role) => role.id === value);
      const level = key;
      RolesObject.push(`${level}:${role?.toString()}`);
    }
    if (!RolesObject[0]) {
      message.reply(
        GetLanguage("NoLevelRolesWereFound", cachedConfig.language)
      );
      return;
    }

    const developer = await getDevelopers({ client });

    const embeds = generateLevelRolesEmbed(
      RolesObject,
      cachedConfig.language,
      developer
    );
    pagination({
      author: message.author,
      channel: message.channel as TextChannel,
      embeds,
      fastSkip: true,
      pageTravel: true,
    });
  }
}

function generateLevelRolesEmbed(
  levelRoles: `${string}:${string}`[],
  language: string,
  developer: User
) {
  const embeds = [];
  let k = 10;

  for (let i = 0; i < levelRoles.length; i += 10) {
    const r = levelRoles.slice(i, k);
    let j = i;
    k += 10;
    let info = "";
    r.forEach((levelRole) => {
      info = `${info}\n> **${++j}-** Level: ${
        levelRole.split(":")[0]
      } -> \`Role:\` ${levelRole.split(":")[1]}\n`;
    });

    const embed = new MessageEmbed()
      .setDescription(
        `\`\`\`💢${GetLanguage("LevelRoles", language)}: ${
          levelRoles.length
        }💢\`\`\`\`\`\`⚡${GetLanguage(
          "LevelRolesDescription",
          language
        )}⚡\`\`\`${info}`
      )
      .setFooter(
        `${GetLanguage("Developer", language)}: ${developer.tag}`,
        developer.displayAvatarURL({ dynamic: true })
      );
    embeds.push(embed);
  }
  return embeds;
}
