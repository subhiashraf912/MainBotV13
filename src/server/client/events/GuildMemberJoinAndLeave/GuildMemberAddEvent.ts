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

    if (
      member.guild.id === "888505595689332776" ||
      member.guild.id === "890707791541579857" ||
      member.guild.id === "783991881028993045" ||
      member.guild.id === "915782009270435900"
    ) {
      Canvas.registerFont("assets/fonts/theboldfont.ttf", { family: "Bold" });
      const options = {
        format: "png",
        size: 512,
      };
      const avatar = await Canvas.loadImage(
        member.user.displayAvatarURL({ format: "png", size: 512 })
      );
      const canvas = Canvas.createCanvas(1024, 450);
      const ctx = canvas.getContext("2d");
      const avlf = Canvas.createCanvas(128, 128);
      const afctx = avlf.getContext("2d");
      afctx.drawImage(avatar, 0, 0, 128, 128);

      vibarnt.from(avlf.toBuffer()).getPalette(async (err, palette) => {
        if (err || !palette) return console.log("err");

        let size = 450;

        const avl = Canvas.createCanvas(size, size);
        const actx = avl.getContext("2d");

        let radgrad = actx.createRadialGradient(
          size / 2,
          size / 2,
          0,
          size / 2,
          size / 2,
          size / 2
        );
        radgrad.addColorStop(0, palette.DarkVibrant?.getHex() as string);
        radgrad.addColorStop(0.5, palette.DarkVibrant?.getHex() as string);
        radgrad.addColorStop(1, "transparent");
        actx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
        actx.fillStyle = radgrad;
        actx.fill();
        actx.globalCompositeOperation = "source-in";
        actx.drawImage(avatar, 0, 0, size, size);

        ctx.drawImage(avatar, 0, 0, canvas.width, canvas.width);

        const imd = ctx.getImageData(0, 0, canvas.width, canvas.height);
        glur(imd.data as any, canvas.width, canvas.height, 70);
        ctx.putImageData(imd, 0, 0);

        ctx.fillStyle = palette.LightVibrant?.getHex() as string;
        ctx.shadowColor = palette.DarkMuted?.getHex() as string;

        ctx.shadowBlur = 3;

        ctx.fillStyle = "#ffffff";
        ctx.font = applyText(canvas, member.user.username, 45);
        ctx.fillText(
          member.user.username,
          canvas.width - 440,
          canvas.height - 300
        );

        ctx.font = "35px Bold, Arila, sans-serif";
        ctx.fillText(
          "Welcome",
          canvas.width - canvas.width / 2 - 48 * 2,
          canvas.height - 100
        );
        let serverTitle = "";
        if (member.guild.id === "783991881028993045") {
          serverTitle = "Sen Nightcore";
        } else if (member.guild.id === "890707791541579857") {
          serverTitle = "Laknicek's community";
        } else if (member.guild.id === "915782009270435900") {
          serverTitle = "Kazoku's server";
        }
        ctx.fillText(serverTitle, canvas.width / 2, canvas.height - 50);

        ctx.shadowBlur = 0;
        ctx.drawImage(avl, 0, 0, size, size);

        ctx.shadowBlur = 30;
        ctx.strokeStyle = palette.LightVibrant?.getHex() as string;
        ctx.lineWidth = 20;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        const attachment = new MessageAttachment(
          canvas.toBuffer(),
          `${Date.now()}-${member.id}-welcome.png`
        );
        member.guild.id === "890707791541579857";

        (channel as TextChannel).send({
          files: [attachment],
          content: (welcomeMessage as string)
            .replace("{server-name}", member.guild.name)
            .replace("{member-ping}", `<@${member.id}>`)
            .replace("{member-username}", member.user.username)
            .replace("{member-tag}", member.user.tag)
            .replace("{member-count}", member.guild.memberCount.toString())

        });
      });
      return;
    }
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
