import { Message, VoiceChannel } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getChannel from "../../utils/constants/getChannel";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "move-me",
      category: "utility",
      aliases: ["moveme"],
      userPermissions: ["MOVE_MEMBERS"],
      botPermissions: ["MOVE_MEMBERS"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.member) return;
    if (!message.guild) return;
    const cachedConfig = await getConfig(client, message.guild?.id as string);

    const { language } = cachedConfig;
    let target = message.member;
    let newvc = getChannel({ message, query: args.join(" ") });
    if (!newvc) {
      message.reply(GetLanguage("ChannelNotFound", language));
      return;
    }
    if (!(newvc instanceof VoiceChannel)) {
      message.reply(GetLanguage("VoiceChannelIsRequired", language));
      return;
    }
    if (!target.voice.channel) {
      message.reply({
        content: GetLanguage(
          "MemberNeedsToBeInAVoiceChannel",
          cachedConfig.language
        ),
      });
      return;
    }
    target.voice.setChannel(newvc.id);
    message.reply(
      GetLanguage("MemberGotMovedToANewVC", language)
        .replaceAll("{member}", `\`\`${target.user.tag}\`\``)
        .replaceAll("{channel}", newvc.toString())
    );
  }
}
