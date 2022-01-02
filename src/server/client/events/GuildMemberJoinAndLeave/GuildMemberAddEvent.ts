import { GuildMember, MessageAttachment, Role, TextChannel } from "discord.js";
import BaseEvent from "../../utils/structures/BaseEvent";
import DiscordClient from "../../classes/client";
import Canvas from "canvas";
import vibarnt from "node-vibrant";
import glur from "glur";
import getConfig from "../../utils/constants/getConfig";
import { RankSchema } from "../../utils/MongoDB/Models";
import mongoose from "mongoose";
import configType from "../../../../types/GuildConfig";

export default class GuildMemberAddEvent extends BaseEvent {
  constructor() {
    //@ts-ignore
    super("guildMemberAdd");
  }

  async run(client: DiscordClient, member: GuildMember) {
    const config = await getConfig(client, member.guild.id);
    if (!config) return;
    await this.giveOldRank(client, member, config);
    const channelId = config.welcomeChannel;
    if (!channelId) return;
    let { welcomeImageBackground, welcomeMessage } = config;
    if (!welcomeImageBackground)
      welcomeImageBackground =
        "https://cdn.discordapp.com/attachments/851013737213460510/851125794780872745/1920902.jpg";
    if (!welcomeMessage)
      welcomeMessage =
        "Welcome to {server-name}, {member-ping} hope you enjoy your stay! you're member {member-count}";
    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return;

    //TO BE DONE FOREVER
  }

  async giveOldRank(
    client: DiscordClient,
    member: GuildMember,
    config: configType
  ) {
    let rank = client.ranks.get(`${member.id}-${member.guild.id}`) || null;
    if (!rank) {
      rank = await RankSchema.findOne({
        user: member.id,
        server: member.guild.id,
      });

      if (!rank) {
        rank = await RankSchema.create({
          _id: new mongoose.Types.ObjectId(),
          user: member.id,
          server: member.guild.id,
          level: 0,
          xp: 0,
          lastMessage: Date.now(),
        });
      }
    }
    if (!rank) return;
    else client.ranks.set(`${member.id}-${member.guild.id}`, rank);
    const levelRoles = config.levelRoles;
    const deservedRoles: Role[] = [];
    for (const [key, value] of Object.entries(levelRoles)) {
      const level = parseInt(key);
      let role = member.guild?.roles.cache.find((role) => role.id === value);
      if (rank.level >= level) {
        role && deservedRoles.push(role);
      }
    }
    if (deservedRoles.length !== 0) {
      await member.roles.add(
        deservedRoles,
        "Member's Old roles before leaving the server."
      );
    }
  }
}
//

function applyText(canvas: any, text: string, defaultFontSize: number) {
  const ctx = canvas.getContext("2d");
  do {
    ctx.font = `bold ${(defaultFontSize -= 1)}px Arial,  sans-serif`;
  } while (ctx.measureText(text).width > 600);
  return ctx.font;
}
