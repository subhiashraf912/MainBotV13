import { Message, MessageEmbed, Role, TextChannel, User } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getDevelopers from "../../utils/constants/GetDevelopers";
import pagination from "../../utils/constants/pagination";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "member-join-roles",
      category: "join roles",
      aliases: [],
      userPermissions: ["MANAGE_ROLES"],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);

    let { language } = config;

    const developer = await getDevelopers({ client });

    const { memberJoinRoles } = config;
    if (!memberJoinRoles || !memberJoinRoles[0]) {
      message.reply({
        content: GetLanguage("ThereAreNoMemberJoinRoles", language),
      });
      return;
    }
    const roles: Role[] = [];
    memberJoinRoles.forEach((roleId) => {
      const role = message.guild?.roles.cache.get(roleId);
      role && roles.push(role);
    });
    const embeds = generateRolesEmbed(roles, developer, language);
    pagination({
      message,
      embeds,
      fastSkip: true,
      pageTravel: true,
    });
  }
}

function generateRolesEmbed(roles: Role[], developer: User, language: string) {
  const embeds = [];
  let k = 10;
  for (let i = 0; i < roles.length; i += 10) {
    const r = roles.slice(i, k);
    let j = i;
    k += 10;
    let info = "";
    r.forEach((role) => {
      info = `${info}\n> **${++j}-**${role} \`id: ${role.id}\`\n`;
    });

    const embed = new MessageEmbed()
      .setDescription(
        `\`\`\`💢${GetLanguage("MemberAutoJoinRole", language)}: ${
          roles.length
        }💢\`\`\`\`\`\`⚡${GetLanguage(
          "MemberAutoJoinRolesDescsription",
          language
        )}!⚡\`\`\`${info}`
      )
      .setFooter(
        `${GetLanguage("Developer", language)}: ${developer.tag}`,
        developer.displayAvatarURL({ dynamic: true })
      );
    embeds.push(embed);
  }
  return embeds;
}
