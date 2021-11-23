import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";
import { CreditsSchema } from "../../utils/MongoDB/Models";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "give",
      category: "utility",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const cachedConfig = await getConfig(client, message.guild?.id as string);
    const { language } = cachedConfig;
    if (!args[0]) {
      message.reply(GetLanguage("MissingCreditsArguments", language));
      return;
    }
    let msgCash = parseInt(args[0], 10) || parseInt(args[1], 10);
    if (isNaN(msgCash)) {
      message.reply(GetLanguage("CreditsMustBeOnlyNumbers", language));
      return;
    }
    const index = args.indexOf(msgCash.toString());
    const newArgs = args.splice(index, 1);
    const query = newArgs.join(" ");
    let memberToGive = await getMember({ message, query });
    if (!memberToGive) {
      message.reply(GetLanguage("MemberNotFound", language));
      return;
    }
    if (message.author.id === memberToGive?.id) {
      message.reply(GetLanguage("YouCanNotGiveYourself", language));
      return;
    }
    if (memberToGive.user.bot) {
      message.reply(GetLanguage("YouCanNotGiveABot", language));
      return;
    }
    let memberData: any = await CreditsSchema.findOne({
      user: message.author.id,
    });
    if (!memberData) {
      message.reply(GetLanguage("MemberDoesNotHaveEnoughCredits", language));
      return;
    }
    let memberToGiveData: any = await CreditsSchema.findOne({
      user: memberToGive.user.id,
    });

    if (!memberToGiveData)
      memberToGiveData = await CreditsSchema.create({
        user: memberToGive.user.id,
        credits: 0,
        lastDaily: Date.now(),
      });

    if (memberData.credits < msgCash) {
      message.reply(GetLanguage("MemberDoesNotHaveEnoughCredits", language));
      return;
    }
    const firstCredits = memberData.credits - msgCash;
    const secCredits = memberToGiveData.credits + msgCash;

    memberData = await CreditsSchema.findOneAndUpdate(
      { user: message.author.id },
      { $set: { credits: firstCredits } },
      { new: true }
    );
    memberToGiveData = await CreditsSchema.findOneAndUpdate(
      { user: memberToGive.id },
      { $set: { credits: secCredits } },
      { new: true }
    );

    message.reply(
      GetLanguage("MemberGaveCredits", language)
        .replaceAll("{author}", message.author.toString())
        .replaceAll("{target}", memberToGive.toString())
        .replaceAll("{credits}", msgCash.toString())
    );
  }
}
