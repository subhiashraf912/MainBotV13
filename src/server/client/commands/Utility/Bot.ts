import {
  ColorResolvable,
  Guild,
  GuildMember,
  Message,
  MessageEmbed,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import ms from "ms";
import moment from "moment";
import getDevelopers from "../../utils/constants/GetDevelopers";
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "bot",
      category: "utility",
      aliases: ["info"],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);
    if (!message.guild) return;
    if (!client.user) return;
    const developer = await getDevelopers({ client });
    const ping = `> ${
      ((Date.now() - message.createdTimestamp) / 3).toString().split(".")[0]
    }`;
    const shards = `> ${client.ws.shards.size}`;
    const uptime = `> ${ms(client.uptime || 0)}`;
    const commands = `> ${client.commands.size}`;
    const events = `> ${client.events.size + client.distubeEvents.size}`;
    const usersCount = `> ${client.guilds.cache.reduce(
      (a, g) => a + g.memberCount,
      0
    )}`;
    const memoryUsage = `> ${
      Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100
    }MB`;
    const guildsCount = `> ${client.guilds.cache.size}`;
    const target = message.guild.me as GuildMember;
    if (!target) return;
    const language = config.language;
    const prefix = config.prefix;
    const JoinedAt = `> ${moment(target.joinedTimestamp)}`;
    const CreatedAt = `> ${moment(target.user.createdTimestamp)}`;
    const DisplayColor = `> ${target.displayHexColor}`;
    const HexColor = `${target.displayHexColor}`;
    const Roles = `> ${target.roles.cache.map((r) => `${r}`).join(" ")}`;
    const AvatarURL = target.user.displayAvatarURL({
      dynamic: true,
      size: 4096,
    });

    const embed = new MessageEmbed()
      .setDescription(`\`\`\`${target.user.tag}\`\`\``)
      .addField(GetLanguage("JoinedAt", language), JoinedAt, true)
      .addField(GetLanguage("CreatedAt", language), CreatedAt, true)
      .addField(GetLanguage("Prefix", language), `> ${prefix}`)
      .addField(GetLanguage("MemoryUsage", language), memoryUsage, true)
      .addField(GetLanguage("Ping", language), ping, true)
      .addField(GetLanguage("Uptime", language), uptime, true)
      .addField(GetLanguage("Shards", language), shards, true)
      .addField(GetLanguage("CommandsSize", language), commands, true)
      .addField(GetLanguage("EventsSize", language), events, true)
      .addField(GetLanguage("UsersCount", language), usersCount, true)
      .addField(GetLanguage("GuildsCount", language), guildsCount, true)
      .addField(GetLanguage("DisplayColor", language), DisplayColor, true)
      .addField(GetLanguage("Roles", language), Roles)
      .setThumbnail(AvatarURL)
      .setColor(HexColor as ColorResolvable)
      .setFooter(
        `${GetLanguage("Developer", config.language)}: ${developer.tag}`,
        developer.displayAvatarURL({ dynamic: true, size: 4096 })
      );
    message.reply({ embeds: [embed] });
  }
}
