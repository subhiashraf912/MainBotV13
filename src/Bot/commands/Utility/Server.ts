import { Message, MessageEmbed, VoiceChannel } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import moment, { Moment } from "moment";
import getDevelopers from "../../utils/constants/GetDevelopers";
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "server",
      category: "utility",
      aliases: ["guild", "server-info", "guild-info"],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);
    if (!message.guild || !message.member) return;
    const { language } = config;

    const developer = await getDevelopers({ client });
    const guild = message.guild;
    const afkChannel: string = guild.afkChannel
      ? guild.afkChannel.toString()
      : GetLanguage("NoChannel", language);
    const afkTimeout: number = guild.afkTimeout;
    const channelsSize: number = guild.channels.cache.size;
    const createdAt: Moment = moment(guild.createdTimestamp);
    const emojisSize: number = guild.emojis.cache.size;
    const memberCount: number = guild.memberCount;
    const name: string = guild.name;
    const owner: string = (await guild.fetchOwner({ cache: true })).toString();
    const partnered: boolean = guild.partnered;
    const Roles: number = guild.roles.cache.size;
    const rulesChannel: string = guild.rulesChannel
      ? guild.rulesChannel.toString()
      : GetLanguage("NoChannel", language);

    const systemChannel: string = guild.systemChannel
      ? guild.systemChannel.toString()
      : GetLanguage("NoChannel", language);
    const onlineMembers: number = guild.members.cache.filter(
      (member) => member.presence?.status === "online"
    ).size;
    const dndMembers: number = guild.members.cache.filter(
      (member) => member.presence?.status === "dnd"
    ).size;
    const idleMembers: number = guild.members.cache.filter(
      (member) => member.presence?.status === "idle"
    ).size;
    const offlineMembers: number = guild.members.cache.filter(
      (member) => member.presence?.status === "offline" || !member.presence
    ).size;
    const icon: string = guild.iconURL({ dynamic: true, size: 4096 }) || "";

    const embed = new MessageEmbed()
      .setTitle(GetLanguage("ServerInfo", language))
      .setDescription(
        `\`\`\`${GetLanguage("RequestedBy", language)} ${
          message.author.tag
        }\`\`\`
        \`\`\` 🟢 ${GetLanguage(
          "Online",
          language
        )}: ${onlineMembers} | 🔴 ${GetLanguage(
          "DND",
          language
        )}: ${dndMembers} | 🟡${GetLanguage(
          "Idle",
          language
        )} :${idleMembers} | ⚪${GetLanguage(
          "Offline",
          language
        )}: ${offlineMembers}\`\`\`
        `
      )
      .addField(GetLanguage("Owner", language), owner, true)
      .addField(GetLanguage("GuildName", language), name, true)
      .addField(GetLanguage("CreatedAt", language), createdAt.toString(), true)
      .addField(
        GetLanguage("MemberCount", language),
        memberCount.toString(),
        true
      )
      .addField(GetLanguage("GuildAFKChannel", language), afkChannel, true)
      .addField(GetLanguage("GuildRulesChannel", language), rulesChannel, true)
      .addField(
        GetLanguage("GuildSystemChannel", language),
        systemChannel,
        true
      )
      .addField(
        GetLanguage("GuildRolesCount", language),
        Roles.toString(),
        true
      )
      .addField(
        GetLanguage("GuildIsPartnered", language),
        partnered ? GetLanguage("Yes", language) : GetLanguage("No", language),
        true
      )
      // .addField(GetLanguage("guild_features", language), features, true)
      .addField(
        GetLanguage("GuildEmojisSize", language),
        emojisSize.toString(),
        true
      )
      .addField(
        GetLanguage("GuildChannelsSize", language),
        channelsSize.toString(),
        true
      )
      .addField(
        GetLanguage("GuildAFKTimeout", language),
        afkTimeout.toString(),
        true
      )
      .setColor("BLUE")
      .setThumbnail(icon)
      .setFooter(
        `${GetLanguage("Developer", language)}: ${developer.tag}`,
        developer.displayAvatarURL({ dynamic: true, size: 4096 })
      );
    message.reply({ embeds: [embed] });
  }
}
