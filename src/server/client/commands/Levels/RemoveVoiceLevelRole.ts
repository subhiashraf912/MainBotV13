import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import { GuildConfig } from "../../utils/MongoDB/Models";
import configType from "../../../../types/GuildConfig";
import ms from "ms";
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "remove-voice-level-role",
      category: "levels",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const cachedConfig = await getConfig(client, message.guild?.id as string);
    if (!message.guild || !message.member) return;
    const { language, prefix } = cachedConfig;
    let { voiceLevelRoles } = cachedConfig;
    if (!args[0]) {
      message.reply(
        GetLanguage("RemoveLevelRoleWrongSyntax", language).replaceAll(
          "{prefix}",
          prefix
        )
      );
      return;
    }
    //@ts-ignore
    if (!voiceLevelRoles[ms(args[0])]) {
      message.reply(GetLanguage("LevelWasNotFoundInTheDatabase", language));
      return;
    }
    //@ts-ignore
    delete voiceLevelRoles[ms(args[0])];

    const config = await GuildConfig.findOneAndUpdate(
      { guildId: message.guild.id },
      { $set: { voiceLevelRoles } },
      { new: true }
    );
    client.configs.set(message.guild.id, config as configType);
    message.reply(
      GetLanguage("LevelRoleGotRemoved", language).replaceAll(
        "{level}",
        millisToMinutesAndSeconds(parseInt(args[0], 10))
      )
    );
  }
}
const millisToMinutesAndSeconds = (timeInMiliseconds: number) => {
  let h;
  h = Math.floor(timeInMiliseconds / 1000 / 60 / 60);

  return `${h} Hours`;
};
