import { Guild, Message, MessageEmbed, TextChannel } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import { VoiceRankSchema } from "../../utils/MongoDB/Models";
import VoiceRankType from "../../utils/types/VoiceRankType";
import pagination from "../../utils/constants/pagination";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "",
      category: "",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);
    if (!message.member || !message.guild) return;

    function compare(a: VoiceRankType, b: VoiceRankType) {
      // Use toUpperCase() to ignore character casing

      let comparison = 0;

      if (a.voiceTime > b.voiceTime) comparison = -1;
      if (a.voiceTime < b.voiceTime) comparison = 1;

      return comparison;
    }

    let ranks: VoiceRankType[] = await VoiceRankSchema.find({
      server: message.guild.id,
    });
    if (!ranks)
      return message.reply({
        content: GetLanguage("NoRanksWereFound", config.language),
      });
    let TotalXpForUsers: Array<any> = [];
    for (const [key, value] of Object.entries(ranks)) {
      TotalXpForUsers.push({
        ID: value.user,
        voiceTime: value.voiceTime,
      });
    }
    TotalXpForUsers.sort(compare);
    const embeds = await GenerateLeaderboardsEmbed(
      client,
      TotalXpForUsers,
      message.guild
    );
    pagination({
      embeds,
      message,
      fastSkip: true,
      pageTravel: true,
    });
  }
}

async function GenerateLeaderboardsEmbed(
  client: DiscordClient,
  leaderboards: Array<any>,
  guild: Guild
) {
  const config = await getConfig(client, guild.id);
  const embeds = [];
  let k = 5;
  let x = 0;
  for (let i = 0; i < leaderboards.length; i += 5) {
    const current = leaderboards.slice(i, k);
    let j = i;
    k += 5;
    const icon: string = guild.iconURL({ dynamic: true, size: 4096 }) || "";

    const embed = new MessageEmbed()
      .setTitle(GetLanguage("VoiceLeaderboardList", config.language))
      .setThumbnail(icon);
    current.forEach((element) => {
      let member = client.users.cache.find((user) => user.id === element.ID);
      if (member) {
        embed.addField(
          `**${x + 1}-** ${member.username}`,
          ` \`${GetLanguage(
            "VoiceTime",
            config.language
          )}:\` \`${millisToMinutesAndSeconds(element.voiceTime)} \``
        );
      } else {
        embed.addField(
          `**${x + 1}-** ${GetLanguage("MemberNotFound", config.language)}`,
          ` \`${GetLanguage(
            "VoiceTime",
            config.language
          )}:\` \`${millisToMinutesAndSeconds(element.voiceTime)} \``
        );
      }
      x = x + 1;
    });

    embeds.push(embed);
  }
  return embeds;
}

const millisToMinutesAndSeconds = (timeInMiliseconds: number) => {
  let h, m, s;
  h = Math.floor(timeInMiliseconds / 1000 / 60 / 60);
  m = Math.floor((timeInMiliseconds / 1000 / 60 / 60 - h) * 60);
  s = Math.floor(((timeInMiliseconds / 1000 / 60 / 60 - h) * 60 - m) * 60);
  return `${h} Hours - ${m} Minutes - ${s} Secs`;
};
