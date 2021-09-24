import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";
import { CreditsSchema } from "../../utils/MongoDB/Models";
import mongoose from "mongoose";
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "update-credits",
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
        content: GetLanguage("NewCreditsAreRequired", config.language),
      });
      return;
    }
    let msgCredits = parseInt(args[0], 10) || parseInt(args[1], 10);
    if (isNaN(msgCredits)) {
      message.reply({
        content: GetLanguage("CreditsMustBeOnlyNumbers", config.language),
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
        content: GetLanguage("MemberToGiveCreditsIsABot", config.language),
      });
      return;
    }

    let memberData: any = await CreditsSchema.findOne({
      user: memberToGive.id,
    });
    if (!memberData) {
      memberData = await CreditsSchema.create({
        _id: new mongoose.Types.ObjectId(),
        user: memberToGive.id,
        credits: msgCredits,
        lastDaily: Date.now(),
      });
      {
        message.reply({
          content: GetLanguage("CreditsHaveBeenUpdated", config.language),
        });
        return;
      }
    }
    memberData = await CreditsSchema.findOneAndUpdate(
      { user: memberToGive.id },
      { credits: msgCredits },
      { new: true }
    );
    message.reply({
      content: GetLanguage("CreditsHaveBeenUpdated", config.language),
    });
  }
}
