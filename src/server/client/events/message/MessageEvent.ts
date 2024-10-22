import BaseEvent from "../../utils/structures/BaseEvent";
import { Message, PermissionString } from "discord.js";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";

export default class MessageEvent extends BaseEvent {
  constructor() {
    super("messageCreate");
  }

  async run(client: DiscordClient, message: Message) {
    if (message.author.bot) return;
    if (!message.guild) {
      if (
        message.content.toLowerCase().includes("nitro") &&
        message.content.toLowerCase().includes("http")
      ) {
        const member = client.guilds.cache
          .get("783991881028993045")
          ?.members?.cache.get(message.author.id);
        if (member) member.ban();
      }
      return;
    }

    const config = await getConfig(client, message.guild.id);
    let prefix = config.prefix;
    if (message.content.split(" ")[0].includes(client.user?.id as string))
      prefix = message.content.split(" ")[0];
    if (message.content.toLowerCase().startsWith(prefix.toLowerCase())) {
      const [cmdName, ...cmdArgs] = message.content
        .slice(prefix.length)
        .trim()
        .split(/\s+/);
      const command =
        client.commands.get(cmdName.toLowerCase()) ||
        client.commands.get(
          client.aliases.get(cmdName.toLowerCase()) as string
        );
      if (command) {
        const missingPerms:PermissionString[] = [];
        command.getUserPermissions().map((perm) => {
          if (!message.member?.permissions.has(perm)) {
            missingPerms.push(perm);
          }
        });
        if (missingPerms[0]) {
          return message.reply({
              content: GetLanguage(
                "MemberIsMissingPermissions",
                config.language
              ).replaceAll("{permissions}", missingPerms.join(', ')),
            });
        }
        const clientMissingPerms:PermissionString[] = [];
        command.getBotPermissions().map((perm) => {
          if (!message.member?.guild.me?.permissions.has(perm)) {
            clientMissingPerms.push(perm);
          }
        });
            if (clientMissingPerms[0]) {
            return message.reply({
              content: GetLanguage(
                "ClientIsMissingPermissions",
                config.language
              ).replaceAll("{permissions}", clientMissingPerms.join(", ")),
            });
          }
        if (command.getCategory() === "owner") {
          if (!client.owners.has(message.author.id))
            return message.reply({
              content: GetLanguage(
                "OnlyClientOwnersCanAccessThisCommand",
                config.language
              ),
            });
        }
        command.run(client, message, cmdArgs);
      }
    }
  }
}
