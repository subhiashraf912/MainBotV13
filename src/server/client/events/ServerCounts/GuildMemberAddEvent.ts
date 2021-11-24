// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
import { GuildMember } from "discord.js";
import BaseEvent from "../../utils/structures/BaseEvent";
import DiscordClient from "../../classes/client";

export default class GuildMemberAddEvent extends BaseEvent {
  constructor() {
    super("guildMemberAdd");
  }

  async run(client: DiscordClient, member: GuildMember) {
    const config = client.configs.get(member.guild.id);
    if (!config) return;
    const { serverStats } = config;
    const { botCount, memberCount } = serverStats;

    if (member.user.bot) {
      if (!botCount) return;
      await member.guild.members.fetch();
      let BotsSize = member.guild.members.cache.filter(
        (member) => member.user.bot
      ).size;
      const channel = member.guild.channels.cache.get(botCount);
      if (channel) {
        channel.setName(`Bot Count: ${BotsSize}`);
        return;
      }
    } else {
      if (!memberCount) return;
      const channel = member.guild.channels.cache.get(memberCount);
      if (channel) {
        channel.setName(
          `Member Count: ${member.guild.memberCount.toLocaleString()}`
        );
      }
    }
  }
}
