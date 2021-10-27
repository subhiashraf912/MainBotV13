import { GuildMember, Message, MessageAttachment } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";
import { RankBackgroundSchema, RankSchema } from "../../utils/MongoDB/Models";
import { Rank } from "../../utils/Modules/AzeCord";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "rank",
      category: "levels",
      aliases: [],
      userPermissions: [],
      botPermissions: ["ATTACH_FILES"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);

    if (!message.guild || !message.member) return;

    const member = (await getMember({
      message,
      query: args.join(" "),
      returnAuthor: true,
    })) as GuildMember;

    let memberAvatar: string = member.user.displayAvatarURL({
      format: "png",
      size: 4096,
    });
    let memberUserName: string = member.user.username;
    let Discriminator: string = member.user.discriminator;

    let data: any = client.ranks.get(`${member.user.id}-${member.guild.id}`);
    let rankBackground: any = client.rankBackgrounds.get(member.user.id);
    if (!data) {
      data = await RankSchema.findOne({
        user: member.user.id,
        server: member.guild.id,
      });
      if (!data) {
        message.reply({
          content: GetLanguage(
            "MemberDoesNotHaveARank",
            config.language
          ).replaceAll("{member}", member.user.tag),
        });
        return;
      }
      client.ranks.set(`${member.user.id}-${member.guild.id}`, data);
    }
    if (!rankBackground) {
      rankBackground = await RankBackgroundSchema.findOne({
        user: member.user.id,
      });
      if (!rankBackground) {
        rankBackground = await RankBackgroundSchema.create({
          user: member.user.id,
          rankBackground: null,
        });
      }
      client.rankBackgrounds.set(member.user.id, rankBackground);
      if (!rankBackground) return;
    }
    let color, color2, color3;

    switch (member.presence?.status) {
      case "offline":
        color = "#f2f1ef";
        color2 = "#abb7b7";
        color3 = "#dadfe1";
      case "online":
        color = "#55ff34";
        color2 = "#199900";
        color3 = "#87ff70";
      case "dnd":
        color = "#ff4642";
        color2 = "#f50500";
        color3 = "#ffb4b3";
      case "idle":
        color = "#fff528";
        color2 = "#b8af00";
        color3 = "#423f00";
      case "invisible":
        color = "#f2f1ef";
        color2 = "#abb7b7";
        color3 = "#dadfe1";
      default:
        color = "#f2f1ef";
        color2 = "#abb7b7";
        color3 = "#dadfe1";
    }

    const rank = new Rank()
      .setAvatar(memberAvatar)
      .setCurrentXP(data.xp)
      .setRequiredXP(5 * Math.pow(data.level, 2) + 50 * data.level + 100)
      .setStatus(member.presence?.status)
      .setProgressBar("#FFFFFF", "COLOR")
      .setUsername(memberUserName)
      .setDiscriminator(Discriminator)
      .setLevel(data.level)
      .setCustomStatusColor(color)
      .setProgressBar(
        [color as string, color2 as string, color3 as string],
        "GRADIENT"
      )
      .setLevelColor(undefined, color);

    if (rankBackground.rankBackground) {
      rank.setBackground("IMAGE", rankBackground.rankBackground);
    }

    rank.build().then((data: any) => {
      const attachment = new MessageAttachment(data, "RankCard.png");
      message.reply({ files: [attachment] });
    });
  }
}
