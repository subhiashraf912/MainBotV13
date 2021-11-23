import { ColorResolvable, Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getRole from "../../utils/constants/getRole";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "set-color",
      category: "moderation",
      aliases: [],
      userPermissions: ["MANAGE_ROLES"],
      botPermissions: ["MANAGE_ROLES"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member) return;
    const cachedConfig = await getConfig(client, message.guild.id);
    const { language } = cachedConfig;
    const role = await getRole({
      message,
      query: args[0],
    });
    if (!role) {
      message.reply(GetLanguage("RoleNotFound", language));
      return;
    }
    if (!role.editable) {
      message.reply(GetLanguage("BotIsMissingEditRolePerms", language));
      return;
    }
    role
      .setColor(
        args[1].toUpperCase() as ColorResolvable,
        `By: ${message.member.user.tag}`
      )
      .catch((err) => {
        message.reply(
          `${GetLanguage("ErrorOccured", language)}\n${err.message}`
        );
        return;
      })
      .then(() => {
        message.reply(GetLanguage("RoleColorUpdated", language));
        return;
      });
  }
}
