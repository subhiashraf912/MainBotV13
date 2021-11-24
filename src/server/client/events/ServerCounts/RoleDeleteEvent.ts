// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-roleDelete
import { Role } from "discord.js";
import BaseEvent from "../../utils/structures/BaseEvent";
import DiscordClient from "../../classes/client";

export default class RoleDeleteEvent extends BaseEvent {
  constructor() {
    super("roleDelete");
  }

  async run(client: DiscordClient, role: Role) {
    const config = client.configs.get(role.guild.id);
    if (!config) return;
    const { serverStats } = config;
    const { rolesCount } = serverStats;
    if (!rolesCount) return;
    const channel = role.guild.channels.cache.get(rolesCount);
    if (channel) {
      channel.setName(`Roles Count: ${role.guild.roles.cache.size}`);
    }
  }
}
