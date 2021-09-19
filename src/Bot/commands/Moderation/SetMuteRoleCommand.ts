import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getRole from "../../utils/constants/getRole";
import { GuildConfig } from "../../utils/MongoDB/Models";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "set-mute-role",
      category: "moderation",
      aliases: [],
      userPermissions: ["MANAGE_ROLES"],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild) return;
    if (!message.member) return;
    const cachedConfig = await getConfig(client, message.guild.id);
    const { language } = cachedConfig;
    let role = await getRole({
      message,
      query: args[0],
    });

    if (!role) {
      message.reply(GetLanguage("RoleNotFound", language));
      return;
    }

    const config: any = await GuildConfig.findOneAndUpdate(
      { guildId: message.guild.id },
      {
        muteRoleId: role.id,
      },
      { new: true }
    );

    client.configs.set(message.guild.id, config);
    message.reply({
      content: GetLanguage("MuteRoleGotSet", language).replace(
        "{roleName}",
        role.name
      ),
    });
  }
}
