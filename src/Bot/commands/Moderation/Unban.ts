import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import { config } from "process";
import getUser from "../../utils/constants/getUser";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "unban",
      category: "moderation",
      aliases: [],
      userPermissions: ["BAN_MEMBERS"],
      botPermissions: ["BAN_MEMBERS"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild) return;
    if (!message.member) return;
    const cachedConfig = await getConfig(client, message.guild.id);
    const { language } = cachedConfig;
    if (!args[0]) {
      message.reply({
        content: GetLanguage("MemberToUnbanIsRequired", language),
      });
      return;
    }
    const user = await getUser({
      message,
      query: args[0],
    });
    if (!user) {
      message.reply({
        content: GetLanguage("UserNotFound", language),
      });
    }

    args.shift();
    let reason = args.join(" ") || "No reason!";

    message.guild?.bans.fetch().then(async (bans) => {
      if (bans.size == 0) return;
      let bUser = bans.find((b) => b.user.id === user?.id);
      if (!bUser)
        return message.reply(GetLanguage("MemberIsNotBanned", language));
      message.guild?.members
        .unban(
          bUser.user,
          `{responsible user: ${message.author.tag}} ${reason}`
        )
        .then(async () => {
          let user = await client.users.fetch(args[0]);
          try {
            await user.send(
              GetLanguage("MemberIsUnbanned", language)
                .replaceAll("{guild}", message.guild?.name as string)
                .replaceAll("{by}", message.author.tag)
            );
          } catch (err) {}

          await message.react("✅");
        });
    });
  }
}
