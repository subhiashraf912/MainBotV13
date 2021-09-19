import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "unmute",
      category: "moderation",
      aliases: [],
      userPermissions: ["KICK_MEMBERS"],
      botPermissions: ["MANAGE_ROLES"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild) return;
    if (!message.member) return;
    const cachedConfig = await getConfig(client, message.guild.id);
    const { language, muteRoleId } = cachedConfig;
    let target = await getMember({
      message,
      query: args[0],
    });
    if (!target) {
      message.reply(GetLanguage("MemberNotFound", language));
      return;
    }
    const muteRole = message.guild.roles.cache.find((r) => r.id === muteRoleId);
    if (!muteRole) {
      message.reply(GetLanguage("MuteRoleNotFound", language));
      return;
    }
    if (!muteRole.editable) {
      message.reply(GetLanguage("BotIsMissingMuteRolePerms", language));
      return;
    }
    if (!target.roles.cache.has(muteRole.id)) {
      message.reply(GetLanguage("MemberIsNotMuted", language));
      return;
    }
    target.roles.remove(muteRole).then(() => {
      message.reply(
        GetLanguage("RemovedMuteRoleFromMember", language).replace(
          "{member}",
          target?.user.tag as string
        )
      );
    });
  }
}
