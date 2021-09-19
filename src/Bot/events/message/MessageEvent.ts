import BaseEvent from "../../utils/structures/BaseEvent";
import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";

export default class MessageEvent extends BaseEvent {
  constructor() {
    super("messageCreate");
  }

  async run(client: DiscordClient, message: Message) {
    if (message.author.bot) return;
    if (!message.guild) return;
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
        command.getUserPermissions().map((perm) => {
          if (!message.member?.permissions.has(perm)) {
            return message.reply({
              content: GetLanguage(
                "MemberIsMissingPermissions",
                config.language
              ).replace("{permissions}", perm),
            });
          }
        });
        command.getBotPermissions().map((perm) => {
          if (!message.member?.guild.me?.permissions.has(perm)) {
            return message.reply({
              content: GetLanguage(
                "ClientIsMissingPermissions",
                config.language
              ).replace("{permissions}", perm),
            });
          }
        });
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
    } else {
      prefix = "";
      const [cmdName, ...cmdArgs] = message.content
        .slice(prefix.length)
        .trim()
        .split(/\s+/);
      const command =
        client.nonPrefixedCommands.get(cmdName.toLowerCase()) ||
        client.nonPrefixedCommands.get(
          client.nonPrefixedCommandsAliases.get(cmdName.toLowerCase()) as string
        );

      if (command) {
        command.getUserPermissions().map((perm) => {
          if (!message.member?.permissions.has(perm)) {
            return message.reply({
              content: GetLanguage(
                "MemberIsMissingPermissions",
                config.language
              ).replace("{permissions}", perm),
            });
          }
        });
        command.getBotPermissions().map((perm) => {
          if (!message.member?.guild.me?.permissions.has(perm)) {
            return message.reply({
              content: GetLanguage(
                "ClientIsMissingPermissions",
                config.language
              ),
            });
          }
        });
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
