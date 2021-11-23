import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getRole from "../../utils/constants/getRole";
import { GuildConfig } from "../../utils/MongoDB/Models";
import configType from "../../../../types/GuildConfig";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "add-level-role",
      category: "levels",
      aliases: [],
      userPermissions: ["MANAGE_GUILD"],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const cachedConfig = await getConfig(client, message.guild?.id as string);
    const language = cachedConfig.language;
    const prefix = cachedConfig.prefix;
    let levelRoles: any = cachedConfig.levelRoles;
    if (!args[0] || !args[1]) {
      message.reply(
        GetLanguage("AddLevelRolesWrongSyntax", language).replaceAll(
          "{prefix}",
          prefix
        )
      );
      return;
    }
    let level = args[0];
    args.shift();
    if (isNaN(parseInt(level))) {
      message.reply(
        GetLanguage("AddLevelRolesWrongSyntax", language).replaceAll(
          "{prefix}",
          prefix
        )
      );
      return;
    }
    let role = await getRole({ query: args.join(" "), message });

    if (!role) {
      message.reply(GetLanguage("RoleNotFound", language));
      return;
    }
    if (!role.editable) {
      message.reply(GetLanguage("BotIsMissingEditRolePerms", language));
      return;
    }
    if (!levelRoles) levelRoles = {};
    levelRoles[level] = role.id;
    const config = await GuildConfig.findOneAndUpdate(
      { guildId: message.guild?.id as string, clientId: client.user?.id },
      { $set: { levelRoles } },
      { new: true }
    );

    client.configs.set(message.guild?.id as string, config as configType);

    message.reply(
      GetLanguage("LevelRolesUpdated", language)
        .replaceAll("{role}", role.name)
        .replaceAll("{level}", level)
    );
  }
}
