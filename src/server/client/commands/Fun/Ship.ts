import { GuildMember, Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import { RolePlaySchema } from "../../utils/MongoDB/Models";
import getMember from "../../utils/constants/getMember";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "ship",
      category: "fun",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member) return;
    const config = await getConfig(client, message.guild.id);
    const firstMember = await getMember({
      message,
      query: args[0],
    });

    const secMember = await getMember({
      message,
      query: args[1],
      returnAuthor: true,
    });

    if (!firstMember) {
      message.reply(GetLanguage("MemberNotFound", config.language));
      return;
    }

    const newName = `${firstMember.user.username.slice(
      0,
      firstMember.user.username.length / 2
    )}${(secMember as GuildMember).user.username.slice(
      (secMember as GuildMember).user.username.length / 2
    )}`;

    let hug: any = await RolePlaySchema.findOne({
      FirstMember: firstMember.id,
      SecMember: secMember?.id,
      Type: "hug",
    });
    if (!hug)
      hug = {
        FirstMember: firstMember.id,
        SecMember: secMember?.id as string,
        Type: "hug",
        times: 0,
      };
    let cuddle: any = await RolePlaySchema.findOne({
      FirstMember: firstMember.id,
      SecMember: secMember?.id,
      Type: "cuddle",
    });
    if (!cuddle)
      cuddle = {
        FirstMember: firstMember.id,
        SecMember: secMember?.id,
        Type: "cuddle",
        times: 0,
      };
    let pat: any = await RolePlaySchema.findOne({
      FirstMember: firstMember.id,
      SecMember: secMember?.id,
      Type: "pet",
    });
    if (!pat)
      pat = {
        FirstMember: firstMember.id,
        SecMember: secMember?.id,
        Type: "pet",
        times: 0,
      };
    let kiss: any = await RolePlaySchema.findOne({
      FirstMember: firstMember.id,
      SecMember: secMember?.id,
      Type: "kiss",
    });
    if (!kiss)
      kiss = {
        FirstMember: firstMember.id,
        SecMember: secMember?.id,
        Type: "kiss",
        times: 0,
      };

    let handsHold: any = await RolePlaySchema.findOne({
      FirstMember: firstMember.id,
      SecMember: secMember?.id,
      Type: "handhold",
    });
    if (!handsHold)
      handsHold = {
        FirstMember: firstMember.id,
        SecMember: secMember?.id,
        Type: "handhold",
        times: 0,
      };

    let hug2: any = await RolePlaySchema.findOne({
      FirstMember: secMember?.id,
      SecMember: firstMember.id,
      Type: "hug",
    });
    if (!hug2)
      hug2 = {
        times: 0,
      };
    let cuddle2: any = await RolePlaySchema.findOne({
      FirstMember: secMember?.id,
      SecMember: firstMember.id,
      Type: "cuddle",
    });
    if (!cuddle2)
      cuddle2 = {
        times: 0,
      };
    let pat2: any = await RolePlaySchema.findOne({
      FirstMember: secMember?.id,
      SecMember: firstMember.id,
      Type: "pet",
    });
    if (!pat2)
      pat2 = {
        times: 0,
      };
    let kiss2: any = await RolePlaySchema.findOne({
      FirstMember: secMember?.id,
      SecMember: firstMember.id,
      Type: "kiss",
    });
    if (!kiss2)
      kiss2 = {
        times: 0,
      };

    let handsHold2: any = await RolePlaySchema.findOne({
      FirstMember: secMember?.id,
      SecMember: firstMember.id,
      Type: "handhold",
    });
    if (!handsHold2)
      handsHold2 = {
        FirstMember: secMember?.id,
        SecMember: firstMember.id,
        Type: "handhold",
        times: 0,
      };

    const hugs = hug.times + hug2.times;
    const cuddles = cuddle.times + cuddle2.times;
    const pats = pat.times + pat2.times;
    const handsHolds = handsHold.times + handsHold2.times;
    const kisses = kiss.times + kiss2.times;

    let percentage = hugs + cuddles + pats + handsHolds + kisses;
    if (percentage > 100) percentage = 100;
    const embed = new MessageEmbed()
      .setTitle("💞 Ship uwu 💞")
      .setDescription(
        `\`\`\`💞 ${firstMember.user.username} X ${secMember?.user.username}  (${newName}) 💞\`\`\`❤ Love Amount: ${percentage}% ❤\n kissed ${kisses} times!\nholded each other hands ${handsHolds} times!\n patted each other ${pats} times!\nhugged each other ${hugs} times!\n`
      )
      .setAuthor(
        `❤ ${firstMember.user.username} ❤`,
        firstMember.user.displayAvatarURL({ dynamic: true })
      )
      .setFooter(
        `❤ ${secMember?.user.username} ❤`,
        secMember?.user.displayAvatarURL({ dynamic: true })
      );

    message.reply({ embeds: [embed] });
  }
}
