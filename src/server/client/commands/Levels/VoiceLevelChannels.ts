import { Message, MessageEmbed, User, VoiceChannel } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getDevelopers from "../../utils/constants/GetDevelopers";
import pagination from "../../utils/constants/pagination";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "voice-level-channels",
      category: "levels",
      aliases: [],
      userPermissions: ['MANAGE_CHANNELS'],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);
    const { language } = config;
    const developer = await getDevelopers({ client });
    const voiceLevelsChannels: Array<string> = config.voiceLevelsChannels;
    if (!voiceLevelsChannels) {
      message.reply(GetLanguage("NoLevelChannelsFound", language));
      return;
    }
    if (!voiceLevelsChannels[0]) {
      message.reply(GetLanguage("NoLevelChannelsFound", language));
      return;
    }
    const channels: VoiceChannel[] = [];
    voiceLevelsChannels.forEach((c) => {
      const cnl = message.guild?.channels.cache.find((ch) => ch.id === c);
      if (cnl && cnl instanceof VoiceChannel) channels.push(cnl);
    });
    const embeds = generateEmbeds(channels, developer, language);
    pagination({ embeds, message, fastSkip: true, pageTravel: true });
  }
}

function generateEmbeds(
  channels: VoiceChannel[],
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
