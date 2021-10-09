import {
  GuildChannel,
  Message,
  MessageEmbed,
  TextChannel,
  ThreadChannel,
  User,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getChannel from "../../utils/constants/getChannel";
import pagination from "../../utils/constants/pagination";
import getDevelopers from "../../utils/constants/GetDevelopers";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "level-channels",
      category: "levels",
      aliases: [],
      userPermissions: ["MANAGE_GUILD"],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const cachedConfig = await getConfig(client, message.guild?.id as string);
    const levelsChannels: Array<string> = cachedConfig.levelsChannels;
    if (!levelsChannels) {
      message.reply(GetLanguage("NoLevelChannelsFound", cachedConfig.language));
      return;
    }
    if (!levelsChannels[0]) {
      message.reply(GetLanguage("NoLevelChannelsFound", cachedConfig.language));
      return;
    }

    const channels: (GuildChannel | ThreadChannel)[] = [];
    for (const channel of levelsChannels) {
      const ch = getChannel({
        message,
        query: channel,
      });
      ch && channels.push(ch);
    }

    const developer = await getDevelopers({ client });
    const embeds = generateRolesEmbed(
      channels,
      developer,
      cachedConfig.language
    );
    pagination({
      author: message.author,
      channel: message.channel as TextChannel,
      embeds,
      fastSkip: true,
      pageTravel: true,
    });
  }
}

function generateRolesEmbed(
  channels: (GuildChannel | ThreadChannel)[],
  developer: User,
  language: string
) {
  const embeds = [];
  let k = 10;
  for (let i = 0; i < channels.length; i += 10) {
    const r = channels.slice(i, k);
    let j = i;
    k += 10;
    let info = "";
    r.forEach((channel) => {
      info = `${info}\n> **${++j}-**${channel} \`id: ${channel.id}\`\n`;
    });

    const embed = new MessageEmbed()
      .setDescription(
        `\`\`\`💢${GetLanguage("LevelChannels", language)}: ${
          channels.length
        }💢\`\`\`\`\`\`⚡${GetLanguage(
          "LevelChannelsDescription",
          language
        )}⚡\`\`\`${info}`
      )
      .setFooter(
        `${GetLanguage("Developer", language)}: ${developer.tag}`,
        developer.displayAvatarURL({ dynamic: true })
      );
    embeds.push(embed);
  }
  return embeds;
}
