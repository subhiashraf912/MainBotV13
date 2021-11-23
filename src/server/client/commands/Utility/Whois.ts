import { Message, MessageEmbed, PresenceStatus } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";
import { GetPerms } from "../../utils/constants/Functions";
import moment from "moment";
import getDevelopers from "../../utils/constants/GetDevelopers";
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "user",
      category: "utility",
      aliases: ["whois"],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);
    if (!message.guild || !message.member) return;
    const { language } = config;

    const developer = await getDevelopers({
      client,
    });
    const target = await getMember({
      message,
      query: args.join(" "),
      returnAuthor: true,
    });
    let Permissions = target.permissions
      .toArray()
      .map((perm) => `${GetPerms(perm)}`)
      .join(" - ");
    const JoinedAt = `> ${moment(target.joinedTimestamp)}`;
    const CreatedAt = `> ${moment(target.user.createdTimestamp)}`;
    const DisplayColor = `> ${target.displayHexColor}`;
    const HexColor = target.displayHexColor;
    const DisplayName = `> ${target.displayName}`;
    const Roles = `> ${target.roles.cache.map((r) => `${r}`).join(" ")}`;
    const Status = `> ${
      target.presence?.status
        ? GetLanguage(this.formatString(target.presence?.status), language)
        : GetLanguage("Offline", language)
    }`;
    const AvatarURL = target.user.displayAvatarURL({
      dynamic: true,
      size: 4096,
    });

    const embed = new MessageEmbed()
      .setDescription(
        `\`\`\`${GetLanguage("UserInfo", language)} ${target.user.tag}\`\`\``
      )
      .addField(GetLanguage("Member", language), target.toString())
      .addField(GetLanguage("JoinedAt", language), JoinedAt, true)
      .addField(GetLanguage("CreatedAt", language), CreatedAt, true)
      .addField(GetLanguage("DisplayName", language), DisplayName)
      .addField(GetLanguage("Status", language), Status, true)
      .addField(
        GetLanguage("IsBot", language),
        target.user.bot
          ? GetLanguage("Yes", language)
          : GetLanguage("No", language),
        true
      )
      .addField(GetLanguage("DisplayColor", language), DisplayColor, true)
      .addField(GetLanguage("Roles", language), Roles)
      .addField(GetLanguage("Permissions", language), Permissions, true)
      .setThumbnail(AvatarURL)
      .setColor(HexColor)
      .setFooter(
        `${GetLanguage("Developer", language)}: ${developer.tag}`,
        developer.displayAvatarURL({ dynamic: true, size: 4096 })
      );
    message.reply({ embeds: [embed] });
  }
  formatString(str: PresenceStatus) {
    return `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}` as
      | "Online"
      | "Offline"
      | "DND"
      | "Invisible"
      | "Idle";
  }
}
