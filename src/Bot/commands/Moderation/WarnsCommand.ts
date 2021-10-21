import { Message, MessageEmbed, TextChannel, User } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";
import { WarnsSchema } from "../../utils/MongoDB/Models";
import WarnsType from "../../utils/types/WarnsType";
import getUser from "../../utils/constants/getUser";
import pagination from "../../utils/constants/pagination";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "warns",
      category: "moderation",
      aliases: ["warnings", "infractions"],
      userPermissions: ["KICK_MEMBERS"],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild) return;
    if (!message.member) return;
    const cachedConfig = await getConfig(client, message.guild.id);
    const { language } = cachedConfig;
    let member = await getMember({
      query: args.join(" "),
      returnAuthor: true,
      message,
    });

    let memberWarns: any = await WarnsSchema.findOne({
      user: member?.user.id,
      guild: message.guild.id,
    });
    if (!memberWarns) {
      message.reply({ content: GetLanguage("NoWarnsFound", language) });
    } else {
      const embeds = await generateEmbeds(
        message,
        memberWarns.warns,
        language,
        member?.user as User
      );
      pagination({
        message,
        embeds,
        fastSkip: true,
        pageTravel: true,
      });
    }
  }
}

async function generateEmbeds(
  message: Message,
  warns: WarnsType[],
  language: string,
  user: User
) {
  const embeds = [];
  let k = 5;
  for (let i = 0; i < warns.length; i += 5) {
    const current = warns.slice(i, k);
    let j = i;
    k += 5;
    let info = "";
    for (const warn of current) {
      info = `${info}\n\`\`\`css\n${++j}) ${GetLanguage("For", language)}: ${
        warn.reason
      } || ${GetLanguage("By", language)}: ${
        (await getUser({ message, query: warn.by }))?.tag ||
        GetLanguage("UnknownRequester", language)
      } || ${GetLanguage("At", language)}: ${new Date(warn.date)}\`\`\``;
    }
    const embed = new MessageEmbed().setDescription(
      `\`\`\`🥔 ${GetLanguage("MemberWarnsList", language).replace(
        "{user}",
        user.tag
      )} 🥔\`\`\`\n${info}`
    );
    embeds.push(embed);
  }
  return embeds;
}
