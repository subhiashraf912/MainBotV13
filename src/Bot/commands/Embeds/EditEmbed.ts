import {
  ColorResolvable,
  Message,
  MessageCollector,
  MessageEmbed,
  MessageReaction,
  TextChannel,
  User,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import { Collection } from "discord.js";
import getChannel from "../../utils/constants/getChannel";
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "edit-embed",
      category: "embeds",
      aliases: [],
      userPermissions: ["MANAGE_MESSAGES"],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member) return;
    const config = await getConfig(client, message.guild.id);
    const questions = [
      GetLanguage("GenerateEmbedTitle", config.language),
      GetLanguage("GenerateEmbedImage", config.language),
      GetLanguage("GenerateEmbedDescription", config.language),
      GetLanguage("GenerateEmbedColor", config.language),
      GetLanguage("EditEmbedChannel", config.language),
      GetLanguage("EditEmbedMessageID", config.language),
    ];
    let counter = 0;
    const filter = (m: Message) => m.author.id === message.author.id;

    const collector = new MessageCollector(message.channel as TextChannel, {
      filter,
      max: questions.length,
      time: 1000 * 120,
    });

    message.reply(questions[counter++]);
    collector.on("collect", (m: Message) => {
      if (counter < questions.length) {
        m.channel.send(questions[counter++]);
      }
    });

    collector.on("end", async (collected) => {
      const collectArray = getArray(collected);
      const url =
        collectArray[1].attachments.first()?.url ||
        (collectArray[1].content !== "none" && collectArray[1].content) ||
        "";
      const color = collectArray[3].content.toUpperCase();
      const channel = getChannel({ query: collectArray[4]?.content, message });
      if (!channel)
        message.reply({
          content: GetLanguage(
            "GenerateEmbedChannelIsMissing",
            config.language
          ),
        });
      const embed = new MessageEmbed()
        .setTitle(
          collectArray[0].content !== "none" ? collectArray[0].content : ""
        )
        .setImage(url)
        .setDescription(
          collectArray[2].content === "none" ? "" : collectArray[2].content
        )
        .setColor(color as ColorResolvable)
        .setFooter(
          `By: ${message.author.tag}`,
          message.author.displayAvatarURL({
            dynamic: true,
          })
        );

      const newMsg = await message.reply({
        content: GetLanguage("GenerateEmbedFinalEmbedTitle", config.language),
        embeds: [embed],
      });

      await newMsg.react("☑");

      const filter = (reaction: MessageReaction, user: User) =>
        ["☑"].includes(reaction.emoji.name as string) &&
        message.author.id == user.id;

      const newCollector = newMsg.createReactionCollector({ filter });
      newCollector.on(
        "collect",
        async (reaction: MessageReaction, user: User) => {
          if (reaction.emoji.name === "☑") {
            reaction.users.remove(user.id);
            const textChannel = channel as TextChannel;
            const msg = await textChannel.messages
              .fetch(collectArray[5].content)
              .catch((err) => message.reply(err));
            msg.edit({ embeds: [embed] });
            message.reply({
              content: GetLanguage("EditEmbedFinalMessage", config.language),
            });
          }
        }
      );
    });
  }
}

const getArray = (Collected: Collection<string, Message>) => {
  const array: Message[] = [];
  Collected.forEach((value) => array.push(value));
  return array;
};
