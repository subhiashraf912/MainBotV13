import {
  ColorResolvable,
  Message,
  MessageEmbed,
  MessageReaction,
  User,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import { akiEmojis, colors, emojis } from "../../utils/constants/Emojis";
const Started = new Set();
const { Aki } = require("aki-api");

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "akinator",
      category: "games",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.member || !message.guild) return;
    const config = await getConfig(client, message.guild.id);
    if (!Started.has(message.author.id)) Started.add(message.author.id);
    else {
      message.reply({
        content: GetLanguage(
          "GameHasAlreadyStarted",
          config.language
        ).replaceAll("{error-emoji}", emojis.err),
      });
      return;
    }
    const aki = new Aki(config.language);
    await aki.start();
    const msg = await message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(
            GetLanguage("AkinatorEmbedTitle", config.language)
              .replaceAll("{author}", message.author.username)
              .replaceAll("{question}", (aki.currentStep + 1).toString())
          )
          .setColor(colors.warn as ColorResolvable)
          .setDescription(
            `**${aki.question}**\n${aki.answers
              .map((x: number, i: number) => `**${x} | ${akiEmojis[i]}**`)
              .join("\n\n")}`
          ),
      ],
    });
    for (let emoji of akiEmojis) await msg.react(emoji).catch(console.error);
    const firstFilter = (reaction: MessageReaction, user: User) =>
      akiEmojis.includes(reaction.emoji.name as string) &&
      user.id === message.author.id;

    const collector = msg.createReactionCollector({
      filter: firstFilter,
      time: 60000 * 6,
    });

    collector.on("collect", async (reaction: MessageReaction, user: User) => {
      reaction.users.remove(user).catch(console.error);
      if (reaction.emoji.name == "❌") return collector.stop();
      await aki.step(akiEmojis.indexOf(reaction.emoji.name as string));
      if (aki.progress >= 70 || aki.currentStep >= 78) {
        await aki.win();
        collector.stop();
        const newMessage = await message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(
                GetLanguage("AkinatorThisIsYourCharacter", config.language)
              )
              .setDescription(
                `**${aki.answers[0].name}**\n${GetLanguage(
                  "RankingAs",
                  config.language
                )} **#${aki.answers[0].ranking}**\n\n[${GetLanguage(
                  "Yes",
                  config.language
                )} (👍) / ${GetLanguage("No", config.language)} (👎)]`
              )
              .setImage(aki.answers[0].absolute_picture_path)
              .setColor(colors.warn as ColorResolvable),
          ],
        });
        await newMessage.react("👍");
        await newMessage.react("👎");
        const filter = (reaction: MessageReaction, user: User) =>
          ["👍", "👎", "❌"].includes(reaction.emoji.name as string) &&
          message.author.id == user.id;
        const collector2 = newMessage.createReactionCollector({ filter });
        collector2.on(
          "collect",
          async (reaction: MessageReaction, user: User) => {
            if (reaction.emoji.name === "👍") {
              reaction.users.remove(user.id);
              return message.reply({
                embeds: [
                  new MessageEmbed()
                    .setColor(colors.done as ColorResolvable)
                    .setTitle(
                      GetLanguage(
                        "AkinatorBotIsTheWinner",
                        config.language
                      ).replaceAll("{emoji}", emojis.done)
                    ),
                ],
              });
            } else if (reaction.emoji.name === "👎") {
              reaction.users.remove(user.id);
              return message.reply({
                embeds: [
                  new MessageEmbed()
                    .setColor(colors.err as ColorResolvable)
                    .setTitle(
                      GetLanguage(
                        "AkinatorMemberIsTheWinner",
                        config.language
                      ).replaceAll("{emoji}", emojis.done)
                    ),
                ],
              });
            } else {
              collector2.stop();
            }
          }
        );
        return;
      }
      msg.edit({
        embeds: [
          new MessageEmbed()
            .setTitle(
              `${message.author.username}, ${GetLanguage(
                "Question",
                config.language
              )} ${aki.currentStep + 1}`
            )
            .setColor(colors.warn as ColorResolvable)
            .setDescription(
              `**${aki.question}**\n${aki.answers
                .map((x: number, i: number) => `**${x} | ${akiEmojis[i]}**`)
                .join("\n\n")}`
            ),
        ],
      });
    });
    collector.on("end", () => {
      Started.delete(message.author.id);
      setTimeout(() => {
        msg.delete().catch((err: Error) => {
          console.log(err);
        });
      }, 1000);
    });
  }
}
