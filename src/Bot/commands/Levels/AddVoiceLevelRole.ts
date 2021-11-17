import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import ms from "ms";
import getRole from "../../utils/constants/getRole";
import { GuildConfig } from "../../utils/MongoDB/Models";
import configType from "../../utils/types/GuildConfig";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "add-voice-level-role",
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

    let { voiceLevelRoles }: any = cachedConfig;
    if (!args[0] || !args[1]) {
      message.reply({
        content: GetLanguage("AddLevelRolesWrongSyntax", language).replaceAll(
          "{prefix}",
          prefix
        ),
      });
      return;
    }

    let level = ms(args[0]);
    if (isNaN(level)) {
      message.reply({
        content: GetLanguage(
          "AddVoiceLevelRolesWrongSyntax",
          language
        ).replaceAll("{prefix}", prefix),
      });
      return;
    }
    args.shift();
    let role = await getRole({ message, query: args.join(" ") });

    if (!role) {
      message.reply({ content: GetLanguage("RoleNotFound", language) });
      return;
    }
    if (!role.editable) {
      message.reply({
        content: GetLanguage("BotIsMissingEditRolePerms", language),
      });
      return;
    }
    if (!voiceLevelRoles) voiceLevelRoles = {};
    voiceLevelRoles[level] = role.id;
    const config = await GuildConfig.findOneAndUpdate(
      { guildId: message.guild?.id as string, clientId: client.user?.id },
      { $set: { voiceLevelRoles } },
      { new: true }
    );

    client.configs.set(message.guild?.id as string, config as configType);

    message.reply({
      content: GetLanguage("LevelRolesUpdated", language)
        .replaceAll("{role}", role.name)
        .replaceAll("{level}", millisToMinutesAndSeconds(level)),
    });
  }
}
const millisToMinutesAndSeconds = (timeInMiliseconds: number) => {
  let h;
  h = Math.floor(timeInMiliseconds / 1000 / 60 / 60);
  return `${h} Hours`;
};
