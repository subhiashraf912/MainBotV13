import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";
import getChannel from "../../utils/constants/getChannel";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "move",
      category: "moderation",
      aliases: [],
      userPermissions: ["MOVE_MEMBERS"],
      botPermissions: ["MOVE_MEMBERS"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.member) return;
    if (!message.guild) return;
    const cachedConfig = await getConfig(client, message.guild.id);
    const { language } = cachedConfig;

    let target = await getMember({
      message,
      query: args[0],
      returnAuthor: true,
    });
    args.shift();
    let newvc = getChannel({
      message,
      query: args.join(" "),
    });
    if (!newvc) {
      message.reply(GetLanguage("ChannelNotFound", language));
      return;
    }
    if (newvc.type !== "GUILD_VOICE" && newvc.type !== "GUILD_STAGE_VOICE") {
      message.reply(GetLanguage("VoiceChannelIsRequired", language));
      return;
    }
    target?.voice.setChannel(newvc.id);
    message.reply(
      GetLanguage("MovedMemberToANewVoiceChannel", language)
        .replaceAll("{member}", `\`\`${target?.user.tag}\`\``)
        .replaceAll("{vc}", newvc.toString())
    );
  }
}
