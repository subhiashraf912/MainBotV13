import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";
import { WarnsSchema } from "../../utils/MongoDB/Models";
import WarnsType from "../../utils/types/WarnsType";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "warn",
      category: "moderation",
      aliases: [],
      userPermissions: ["KICK_MEMBERS"],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild) return;
    if (!message.member) return;
    const cachedConfig = await getConfig(client, message.guild.id);
    const { language } = cachedConfig;
    let member = await getMember({ query: args[0], message });
    if (!member) {
      message.reply(GetLanguage("MemberNotFound", language));
      return;
    }
    args.shift();
    let memberWarns: any = await WarnsSchema.findOne({
      user: member.user.id,
      guild: message.guild.id,
    });

    if (!memberWarns) {
      let by: string = message.author.id;

      let reason: string = args[0]
        ? args.join(" ")
        : GetLanguage("NoReason", language);
      let date: number = Date.now();
      let warns: Array<WarnsType> = [
        { user: member.user.id, guild: message.guild.id, by, reason, date },
      ];
      warns.push;
      memberWarns = await WarnsSchema.create({
        user: member.user.id,
        guild: message.guild.id,
        warns,
      });

      message.reply({
        content: GetLanguage("MemberGotWarned", language)
          .replaceAll("{member}", member.user.tag)
          .replaceAll("{reason}", reason)
          .replaceAll("{warns}", warns.length.toString()),
      });
    } else {
      let by: string = message.author.id;
      let reason: string = args[0]
        ? args.join(" ")
        : GetLanguage("NoReason", language);
      let date: number = Date.now();
      let warns = memberWarns.warns;
      let newWarn = { by, reason, date };
      warns.push(newWarn);

      memberWarns = await WarnsSchema.findOneAndUpdate(
        {
          user: member.user.id,
          guild: message.guild?.id as string,
        },
        {
          warns,
        },
        { new: true }
      );

      message.reply({
        content: GetLanguage("MemberGotWarned", language)
          .replaceAll("{member}", member.user.tag)
          .replaceAll("{reason}", reason)
          .replaceAll("{warns}", warns.length.toString()),
      });
    }
  }
}
