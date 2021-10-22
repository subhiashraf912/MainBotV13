import { Guild, Invite, Message, MessageEmbed, User } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import pagination from "../../utils/constants/pagination";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "invite-leaderboard",
      category: "utility",
      aliases: ["inv-lb"],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);
    if (!message.guild || !message.member) return;
    const guildInvites = await message.guild.invites.fetch();
    const invitesArray: Invite[] = [];
    for (const [key, val] of guildInvites) {
      invitesArray.push(val);
    }

    function compare(a: Invite, b: Invite) {
      const aUses = a.uses ? a.uses : 0;
      const bUses = b.uses ? b.uses : 0;
      let comparison = 0;
      if (aUses > bUses) comparison = -1;
      if (aUses < bUses) comparison = 1;
      return comparison;
    }
    invitesArray.sort(compare);
    const embeds = this.GenerateLeaderboardsEmbed(
      client,
      invitesArray,
      message.guild,
      config.language
    );
    pagination({
      embeds,
      message,
      fastSkip: true,
      pageTravel: true,
    });
  }
  GenerateLeaderboardsEmbed(
    client: DiscordClient,
    leaderboards: Invite[],
    guild: Guild,
    langauge: string
  ) {
    const embeds = [];
    let k = 5;
    let x = 0;
    for (let i = 0; i < leaderboards.length; i += 5) {
      const current = leaderboards.slice(i, k);
      let j = i;
      k += 5;
      const icon: string = guild.iconURL({ dynamic: true, size: 4096 }) || "";

      const embed = new MessageEmbed()
        .setTitle(
          GetLanguage("InvitesLeaderboardTitle", langauge).replace(
            "{guild}",
            guild.name
          )
        )
        .setThumbnail(icon);
      current.forEach((element) => {
        let member = guild.members.cache.get((element.inviter as User).id);
        if (member) {
          embed.addField(
            `**${x + 1}-** ${GetLanguage("Invite", langauge)}: \`${
              element.code
            }\``,
            ` \`${GetLanguage("By", langauge)}:\` \`${
              member.user.tag
            } \` \`${GetLanguage("Uses", langauge)}:\`  \` ${
              element.uses ? element.uses : 0
            } \``
          );
        } else {
          embed.addField(
            `**${x + 1}-** ${GetLanguage("Invite", langauge)}: \`${
              element.code
            }\``,
            ` \`${GetLanguage("By", langauge)}:\` \`${GetLanguage(
              "MemberHasLeft",
              langauge
            )}\` \`${GetLanguage("Uses", langauge)}:\`  \` ${
              element.uses ? element.uses : 0
            } \``
          );
        }
        x = x + 1;
      });

      embeds.push(embed);
    }
    return embeds;
  }
}
