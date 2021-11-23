import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import { CreditsSchema } from "../../utils/MongoDB/Models";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "daily",
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
    let memberData = await CreditsSchema.findOne({
      user: message.author.id,
    });

    if (!memberData) {
      memberData = await CreditsSchema.create({
        user: message.author.id,
        credits: 350,
        lastDaily: Date.now(),
      });

      message.reply(
        GetLanguage("MemberGotDaily", language).replaceAll(
          "{time}",
          millisToMinutesAndSeconds(8.64e7)
        )
      );
      return;
    } else {
      if (Date.now() - memberData.lastDaily > 8.64e7) {
        const credits = memberData.credits + 350;
        const updatedObject = {
          credits,
          lastDaily: Date.now(),
        };
        memberData = (await CreditsSchema.findOneAndUpdate(
          { user: message.author.id },
          updatedObject,
          { new: true }
        )) as any;
        {
          message.reply(
            GetLanguage("MemberGotDaily", language).replaceAll(
              "{time}",
              millisToMinutesAndSeconds(8.64e7)
            )
          );
          return;
        }
      } else {
        {
          message.reply(
            GetLanguage("MemberGotDaily", language).replaceAll(
              "{time}",
              millisToMinutesAndSeconds(
                8.64e7 - (Date.now() - memberData.lastDaily)
              )
            )
          );
          return;
        }
      }
    }
  }
}
const millisToMinutesAndSeconds = (timeInMiliseconds: number) => {
  let h, m, s;
  h = Math.floor(timeInMiliseconds / 1000 / 60 / 60);
  m = Math.floor((timeInMiliseconds / 1000 / 60 / 60 - h) * 60);
  s = Math.floor(((timeInMiliseconds / 1000 / 60 / 60 - h) * 60 - m) * 60);
  return `${h}:${m}:${s}`;
};
