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
      name: "add-bot-join-role",
      category: "join roles",
      aliases: [],
      userPermissions: ["MANAGE_ROLES"],
      botPermissions: [],
      tutorialGif:
        "https://cdn.discordapp.com/attachments/900321704289656872/903191141300707338/AddBotJoinRole.gif",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const cachedConfig = await getConfig(client, message.guild?.id as string);
    let { botJoinRoles } = cachedConfig;
    if (!botJoinRoles) botJoinRoles = [];
    const role = await getRole({
      message,
      query: args.join(" "),
    });
    if (!role) {
      message.reply({
        content: GetLanguage("RoleNotFound", cachedConfig.language),
      });
      return;
    }
    if (botJoinRoles.includes(role.id)) {
      message.reply({
        content: GetLanguage(
          "RoleAlreadyExistsInTheDatabase",
          cachedConfig.language
        ),
      });
      return;
    }
    if (!role.editable) {
      message.reply({
        content: GetLanguage(
          "BotIsMissingEditRolePerms",
          cachedConfig.language
        ),
      });
      return;
    }
    botJoinRoles.push(role.id);
    const config = await GuildConfig.findOneAndUpdate(
      {
        guildId: message.guild?.id as string,
        clientId: client.user?.id,
      },
      {
        botJoinRoles,
      },
      { new: true }
    );

    client.configs.set(message.guild?.id as string, config as configType);
    await message.reply({
      content: GetLanguage("AddedNewBotJoinRole", cachedConfig.language)
        .replaceAll("{role}", role.name)
        .replaceAll("{id}", role.id),
    });
  }
}
