import { Guild, MessageEmbed, TextChannel } from "discord.js";
import BaseEvent from "../../../utils/structures/BaseEvent";
import DiscordClient from "../../../classes/client";

export default class GuildCreateEvent extends BaseEvent {
  constructor() {
    super("guildCreate");
  }

  async run(client: DiscordClient, guild: Guild) {
    const guildOwner = await guild.fetchOwner({ cache: true });
    const icon = guild.iconURL({ size: 4096, format: "png" }) || "";
    const channel = await client.channels.fetch("913084124703645716");
    if (channel?.type !== "GUILD_TEXT") return;
    const audit = await guild.fetchAuditLogs({
      type: "BOT_ADD",
      limit: 1,
    });
    if (!channel) return;
    const embed = new MessageEmbed()
      .setTitle(`${client.user?.username} Join Logs`)
      .setDescription(
        `
    \`\`\`
    Server Name: ${guild.name}
    \`\`\`
    \`\`\`
    Server ID: ${guild.id}
    \`\`\`
    \`\`\`
    Server Owner: ${guildOwner?.user.tag}
    \`\`\`
    \`\`\`
    Added By: ${audit.entries.first()?.executor?.tag || "unknown"}
    \`\`\`
    Owner: ${guildOwner}
    By: ${audit.entries.first()?.executor}
      `
      )
      .setTimestamp()
      .setAuthor(`${guild.name}`, icon);
    (channel as TextChannel).send({ embeds: [embed] });
  }
}
