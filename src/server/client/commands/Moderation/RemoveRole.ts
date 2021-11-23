import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";
import getRole from "../../utils/constants/getRole";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "remove-role",
      category: "moderation",
      aliases: [],
      userPermissions: ["MANAGE_ROLES"],
      botPermissions: ["MANAGE_ROLES"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild) return;
    if (!message.member) return;
    const cachedConfig = await getConfig(client, message.guild.id);
    const { language } = cachedConfig;
    if (!args[0] || !args[1]) {
      message.reply({
        content: GetLanguage("RoleAndMemberAreRequired", language),
      });
    }
    const role = await getRole({
      message,
      query: args[0],
    });
    if (!role) {
      message.reply(GetLanguage("RoleNotFound", language));
      return;
    }

    const member = await getMember({
      message,
      query: args[1],
      returnAuthor: true,
    });

    if (!role.editable) {
      message.reply(GetLanguage("BotIsMissingEditRolePerms", language));
      return;
    }
    member?.roles.cache.has(role.id)
      ? member.roles
          .remove(role)
          .then(() =>
            message.reply(
              GetLanguage("MemberRoleGotRemoved", language)
                .replaceAll("{roleName}", role.name)
                .replaceAll("{memberTag}", member.user.tag)
            )
          )
      : message.reply(
          GetLanguage("MemberDoesNotHaveRole", language)
            .replaceAll("{roleName}", role.name)
            .replaceAll("{memberTag}", member?.user.tag as string)
        );
  }
}
