import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";
import { RankSchema } from "../../utils/MongoDB/Models";
import RankType from "../../../../types/RankType";
import mongoose from "mongoose";
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "update-xp",
      category: "owner",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild) return;
    const config = await getConfig(client, message.guild.id);
    if (!args[0]) {
      message.reply({
        content: GetLanguage("NewXPIsRequired", config.language),
      });
      return;
    }
    let msgXP = parseInt(args[0], 10) || parseInt(args[1], 10);
    if (isNaN(msgXP)) {
      message.reply({
        content: GetLanguage("NewXPMustBeANumber", config.language),
      });
      return;
    }
    let memberToGive = await getMember({
      query: args[0],
      message,
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
      `${memberToGive.id}-${message.guild.id}`
    );
    if (!memberData) {
      memberData = await RankSchema.findOne({
        server: message.guild.id,
        user: memberToGive.id,
      });
    }
    if (!memberData) {
      memberData = await RankSchema.create({
        _id: new mongoose.Types.ObjectId(),
        user: memberToGive.id,
        server: message.guild.id,
        level: 0,
        xp: msgXP,
        lastMessage: Date.now(),
      });
      if (!memberData) return;
      client.ranks.set(`${memberToGive.id}-${message.guild.id}`, memberData);
      {
        message.reply({
          content: GetLanguage("XPHasBeenUpdated", config.language),
        });
        return;
      }
    }
    memberData = await RankSchema.findOneAndUpdate(
      { user: memberToGive.id, server: message.guild.id },
      { xp: msgXP },
      { new: true }
    );
    if (!memberData) return;
    client.ranks.set(`${memberToGive.id}-${message.guild.id}`, memberData);
    message.reply({
      content: GetLanguage("XPHasBeenUpdated", config.language),
    });
  }
}
