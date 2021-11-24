// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
import { GuildMember, Role } from "discord.js";
import BaseEvent from "../../utils/structures/BaseEvent";
import DiscordClient from "../../classes/client";
export default class GuildMemberAddEvent extends BaseEvent {
  constructor() {
    super("guildMemberAdd");
  }

  async run(client: DiscordClient, member: GuildMember) {
    const config = client.configs.get(member.guild.id);
    if (!config) return;
    const { botJoinRoles, memberJoinRoles } = config;
    const RolesToAdd: Role[] = [];
    if (member.user.bot) {
      if (botJoinRoles)
        botJoinRoles.forEach((roleId) => {
          const r = member.guild.roles.cache.get(roleId);
          if (r) r.editable && RolesToAdd.push(r);
        });
    }
    if (!member.user.bot) {
      if (memberJoinRoles)
        memberJoinRoles.forEach((roleId) => {
          const r = member.guild.roles.cache.get(roleId);
          if (r) r.editable && RolesToAdd.push(r);
        });
    }
    RolesToAdd[0] &&
      (await member.roles.add(
        RolesToAdd,
        `${client.user?.username} auto roles`
      ));
  }
}
