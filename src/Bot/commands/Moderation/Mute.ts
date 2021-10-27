import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "mute",
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
    message.deletable && message.delete();
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
    args.shift();

    const reason = args[0] ? args.join(" ") : "No reason";

    const muteRole = message.guild.roles.cache.find((r) => r.id === muteRoleId);
    if (!muteRole) {
      message.reply(GetLanguage("MuteRoleWasNotFound", language));
      return;
    }
    if (!muteRole.editable) {
      message.reply(GetLanguage("BotIsMissingMuteRolePerms", language));
      return;
    }

    for (const channel of message.guild.channels.cache.values()) {
      if (channel.type === "GUILD_TEXT") {
        if (
          channel.permissionsFor(muteRole).has("SEND_MESSAGES") ||
          channel.permissionsFor(muteRole).has("ATTACH_FILES") ||
          channel.permissionsFor(muteRole).has("SPEAK") ||
          channel.permissionsFor(muteRole).has("SEND_TTS_MESSAGES")
        )
          await channel.permissionOverwrites.edit(muteRole, {
            SEND_MESSAGES: false,
            ATTACH_FILES: false,
            SPEAK: false,
          });
      } else if (
        channel.type === "GUILD_VOICE" ||
        channel.type === "GUILD_STAGE_VOICE"
      ) {
        if (
          channel.permissionsFor(muteRole).has("SEND_MESSAGES") ||
          channel.permissionsFor(muteRole).has("ATTACH_FILES") ||
          channel.permissionsFor(muteRole).has("SPEAK") ||
          channel.permissionsFor(muteRole).has("SEND_TTS_MESSAGES")
        )
          await channel.permissionOverwrites.edit(muteRole, {
            SEND_MESSAGES: false,
            ATTACH_FILES: false,
            SPEAK: false,
          });
      }
    }

    if (target.roles.cache.has(muteRole.id)) {
      message.reply(GetLanguage("MemberIsMuted", language));
      return;
    }
    target.roles
      .add(muteRole, `By: ${message.author.tag} for ${reason}`)
      .then(() => {
        return message.reply(
          GetLanguage("AddedMuteRole", language)
            .replaceAll("{member}", target?.user.tag as string)
            .replaceAll("{reason}", reason)
        );
      });
  }
}
