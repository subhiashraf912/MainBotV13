import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";
import { RankSchema } from "../../utils/MongoDB/Models";
import mongoose from "mongoose";
import RankType from "../../utils/types/RankType";
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "update-level",
      category: "owner",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);

    if (!args[0]) {
      message.reply({
        content: GetLanguage("NewLevelIsRequired", config.language),
      });
      return;
    }
    let msgLevel = parseInt(args[0], 10) || parseInt(args[1], 10);
    if (isNaN(msgLevel)) {
      message.reply({
        content: GetLanguage("NewLevelMustBeANumber", config.language),
      });
      return;
    }
    let memberToGive = await getMember({
      message,
      query: args[0],
    });
    if (!memberToGive) {
      message.reply({
        content: GetLanguage("MemberNotFound", config.language),
      });
      return;
    }
    if (memberToGive.user.bot) {
      message.reply({
        content: GetLanguage("MemberToGiveRankIsABot", config.language),
      });
      return;
    }
    let memberData: RankType | null | undefined = client.ranks.get(
      `${memberToGive.id}-${message.guild?.id}`
    );
    if (!memberData) memberData = null;

    if (!memberData) {
      memberData = await RankSchema.findOne({
        server: message.guild?.id as string,
        user: memberToGive.id,
      });
    }

    if (!memberData) {
      memberData = await RankSchema.create({
        _id: new mongoose.Types.ObjectId(),
        user: memberToGive.id,
        server: message.guild?.id as string,
        level: msgLevel,
        xp: 0,
        lastMessage: Date.now(),
      });
      if (!memberData) return;
      client.ranks.set(`${memberToGive.id}-${message.guild?.id}`, memberData);
      message.reply({
        content: GetLanguage("LevelHasBeenUpdated", config.language),
      });
      return;
    }
    memberData = await RankSchema.findOneAndUpdate(
      { user: memberToGive.id, server: message.guild?.id },
      { level: msgLevel, xp: 0 },
      { new: true }
    );
    if (!memberData) return;
    client.ranks.set(`${memberToGive.id}-${message.guild?.id}`, memberData);
    message.reply({
      content: GetLanguage("LevelHasBeenUpdated", config.language),
    });
  }
}
