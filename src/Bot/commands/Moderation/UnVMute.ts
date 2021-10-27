import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "unvmute",
      category: "moderation",
      aliases: [],
      userPermissions: ["MUTE_MEMBERS"],
      botPermissions: ["MUTE_MEMBERS"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild) return;
    if (!message.member) return;
    const cachedConfig = await getConfig(client, message.guild.id);
    const { language } = cachedConfig;
    let target = await getMember({
      message,
      query: args.join(" "),
    });
    if (!target) {
      message.reply({
        content: GetLanguage("MemberNotFound", language),
      });
      return;
    }
    if (!target.voice.channel) {
      message.reply(GetLanguage("MemberIsNotInAVoiceChannel", language));
      return;
    }
    if (!target.voice.mute) {
      message.reply(GetLanguage("MemberIsNotMuted", language));
      return;
    }
    target.voice
      .setMute(false, `responsible user: ${message.author.tag}`)
      .then(() => {
        message.reply(
          GetLanguage("RemovedMuteRoleFromMember", language).replaceAll(
            "{member}",
            target?.user.tag as string
          )
        );
      });
  }
}
