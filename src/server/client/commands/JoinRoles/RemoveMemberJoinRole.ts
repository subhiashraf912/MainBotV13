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
      name: "remove-member-join-role",
      category: "join roles",
      aliases: [],
      userPermissions: ["MANAGE_ROLES"],
      botPermissions: [],
      tutorialGif:
        "https://cdn.discordapp.com/attachments/900321704289656872/903190591666548757/RemoveMemberJoinRole.gif",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const cachedConfig = await getConfig(client, message.guild?.id as string);
    let { memberJoinRoles } = cachedConfig;
    if (!memberJoinRoles) memberJoinRoles = [];

    const role = await getRole({ message, query: args.join(" ") });
    if (!role) {
      message.reply({
        content: GetLanguage("RoleNotFound", cachedConfig.language),
      });
      return;
    }
    if (!memberJoinRoles.includes(role.id)) {
      message.reply({
        content: GetLanguage(
          "RoleDoesNotExistsInTheDatabase",
          cachedConfig.language
        ),
      });
      return;
    }
    const index = memberJoinRoles.indexOf(role.id);

    memberJoinRoles.splice(index, 1);
    const config = await GuildConfig.findOneAndUpdate(
      {
        guildId: message.guild?.id as string,
        clientId: client.user?.id,
      },
      {
        memberJoinRoles,
      },
      { new: true }
    );

    client.configs.set(message.guild?.id as string, config as configType);
    await message.reply({
      content: GetLanguage("RemovedMemberJoinRole", cachedConfig.language)
        .replaceAll("{role}", role.name)
        .replaceAll("{id}", role.id),
    });
  }
}
