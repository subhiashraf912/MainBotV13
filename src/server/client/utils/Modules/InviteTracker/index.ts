import { Client, Guild } from "discord.js";
import invite from "./invite";

declare module "discord.js" {
  interface ClientEvents {
    guildMemberAddWithInvite: [member: GuildMember, invite: invite];
  }
}

export default class InviteTracker {
  private client;
  private guildInvites = new Map();
  constructor(client: Client) {
    if (!(client instanceof Client)) {
      throw new Error("Client should be an instance of discord.js client");
    }
    this.client = client;
  }

  init() {
    this.client.on("inviteCreate", async (invite) => {
      const invites = await (invite.guild as Guild)?.invites.fetch();
      const codeUses = new Map();
      invites.each((inv) => codeUses.set(inv.code, inv.uses));
      this.guildInvites.set(invite.guild?.id, codeUses);
    });

    this.client.once("ready", () => {
      this.client.guilds.cache.forEach((guild) => {
        guild.invites
          .fetch()
          .then((invites) => {
            const codeUses = new Map();
            invites.each((inv) => codeUses.set(inv.code, inv.uses));

            this.guildInvites.set(guild.id, codeUses);
          })
          .catch((err) => {});
      });
    });

    this.client.on("guildMemberAdd", async (member) => {
      const cachedInvites = this.guildInvites.get(member.guild.id);
      const newInvites = await member.guild.invites.fetch();
      try {
        const usedInvite = newInvites.find(
          (inv) => cachedInvites.get(inv.code) < (inv.uses || 0)
        );
        if (!usedInvite) return;
        const inv = new invite({
          channel: usedInvite.channel,
          client: usedInvite.client,
          code: usedInvite.code,
          createdAt: usedInvite.createdAt,
          createdTimestamp: usedInvite.createdTimestamp,
          deletable: usedInvite.deletable,
          expiresAt: usedInvite.expiresAt,
          expiresTimestamp: usedInvite.expiresTimestamp,
          guild: usedInvite.guild,
          inviter: usedInvite.inviter,
          maxAge: usedInvite.maxAge,
          maxUses: usedInvite.maxUses,
          memberCount: usedInvite.memberCount,
          presenceCount: usedInvite.presenceCount,
          stageInstance: usedInvite.stageInstance,
          targetApplication: usedInvite.targetApplication,
          //@ts-ignore
          targetType: usedInvite.targetType,
          targetUser: usedInvite.targetUser,
          temporary: usedInvite.temporary,
        });

        this.client.emit("guildMemberAddWithInvite", member, inv);
      } catch (err) {}

      newInvites.each((inv) => cachedInvites.set(inv.code, inv.uses));
      this.guildInvites.set(member.guild.id, cachedInvites);
    });
  }
}
