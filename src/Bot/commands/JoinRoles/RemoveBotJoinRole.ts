import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getRole from "../../utils/constants/getRole";
import { GuildConfig } from "../../utils/MongoDB/Models";
import configType from "../../utils/types/GuildConfig";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "remove-bot-join-role",
      category: "join roles",
      aliases: [],
      userPermissions: ["MANAGE_ROLES"],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const cachedConfig = await getConfig(client, message.guild?.id as string);
    let { botJoinRoles } = cachedConfig;
    if (!botJoinRoles) botJoinRoles = [];

    const role = await getRole({ message, query: args.join(" ") });
    if (!role) {
      message.reply({
        content: GetLanguage("RoleNotFound", cachedConfig.language),
      });
      return;
    }
    if (!botJoinRoles.includes(role.id)) {
      message.reply({
        content: GetLanguage(
          "RoleDoesNotExistsInTheDatabase",
          cachedConfig.language
        ),
      });
      return;
    }
    const index = botJoinRoles.indexOf(role.id);

    botJoinRoles.splice(index, 1);
    const config = await GuildConfig.findOneAndUpdate(
      {
        guildId: message.guild?.id,
        clientId: client.user?.id,
      },
      {
        botJoinRoles,
      },
      { new: true }
    );

    client.configs.set(message.guild?.id as string, config as configType);
    await message.reply({
      content: GetLanguage("RemovedBotJoinRole", cachedConfig.language)
        .replace("{role}", role.name)
        .replace("{id}", role.id),
    });
  }
}
