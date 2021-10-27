import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "device",
      category: "utility",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);

    let device = "";
    const member = await getMember({
      message,
      query: args.join(" "),
      returnAuthor: true,
    });
    if (
      member?.presence?.status === "offline" ||
      !member?.presence?.clientStatus
    ) {
      message?.channel?.send({
        content: GetLanguage("MemberIsOffline", config.language).replaceAll(
          "{member}",
          member.user.tag
        ),
      });
      return;
    }
    if (member?.presence?.clientStatus?.desktop)
      device = `${device} ● ${GetLanguage("PC", config.language)}`;
    if (member?.presence?.clientStatus?.mobile)
      device = `${device} ● ${GetLanguage("Mobile", config.language)}`;
    if (member?.presence?.clientStatus?.web)
      device = `${device} ● ${GetLanguage("Browser", config.language)}`;
    message?.channel?.send(
      GetLanguage("MemberIsUsingDevice", config.language)
        .replaceAll("{device}", device)
        .replaceAll("{member}", member.user.tag)
    );
  }
}
