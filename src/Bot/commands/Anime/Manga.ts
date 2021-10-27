import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
const kitsu = require("node-kitsu");

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "manga",
      category: "anime",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.member || !message.guild) return;
    const config = await getConfig(client, message.guild.id);
    let searchMessage = args.join(" ");
    if (!searchMessage || searchMessage === "") {
      message.reply({
        content: GetLanguage("MemberNeedsToEnterTheMangaName", config.language),
      });
      return;
    }

    let searchResult = null;

    kitsu
      .searchManga(searchMessage, 0)
      .catch((err: Error) => {
        message.reply({
          content: GetLanguage("ErrorOccured", config.language),
        });
        return;
      })
      .then((results: Array<any>) => {
        searchResult = results[0];
        if (!searchResult) {
          message.reply({
            content: GetLanguage("MangaNotFound", config.language),
          });
        } else {
          let en = searchResult.attributes.titles.en;
          if (!en) {
            en = GetLanguage("EnglishTitleNotFound", config.language);
          }
          let en_jp = searchResult.attributes.titles.en_jp;
          let ja_jp = searchResult.attributes.titles.ja_jp;
          if (!en_jp) {
            en_jp = GetLanguage("JapaneseTitleWasNotFound", config.language);
          }
          let title = searchResult.attributes.canonicalTitle;
          if (!title) {
            if (!en) {
              title = en_jp;
            } else if (!en_jp) {
              title = ja_jp;
            } else {
              title = GetLanguage("CanonTitleWasNotFound", config.language);
            }
          }
          let synopsis = searchResult.attributes.synopsis;
          if (!synopsis) {
            synopsis = GetLanguage("NoSynopsisFound", config.language);
          }
          let episodeCount = searchResult.attributes.episodeCount;
          if (!episodeCount) {
            episodeCount = GetLanguage("Unknown", config.language);
          }
          let episodeLength = searchResult.attributes.episodeLength;
          if (!episodeLength) {
            episodeLength = GetLanguage("Unknown", config.language);
          }

          let status = searchResult.attributes.status;
          let totalLength = searchResult.attributes.totalLength;
          if (!totalLength)
            totalLength = GetLanguage("Unknown", config.language);
          let startDate = searchResult.attributes.startDate;
          let ageRatingGuide = searchResult.attributes.ageRatingGuide;
          if (!ageRatingGuide)
            ageRatingGuide = GetLanguage("Unknown", config.language);
          if (!startDate) {
            startDate = GetLanguage("Unknown", config.language);
          }
          let endDate = searchResult.attributes.endDate;
          if (!endDate) {
            endDate = GetLanguage("Unknown", config.language);
          }
          let smallPoster = searchResult.attributes.posterImage.original;

          let statusUpper =
            status.charAt(0).toUpperCase() + status.substr(1).toLowerCase();

          let embed = new MessageEmbed()
            .setTitle(title)
            .addField(
              `${GetLanguage("OtherNames", config.language)}:`,
              `**${GetLanguage(
                "English",
                config.language
              )}:** \`${en}\`\n**${GetLanguage(
                "EnglishJP",
                config.language
              )}:** \`${en_jp}\`\n**${GetLanguage(
                "Japanese",
                config.language
              )}:** \`${ja_jp}\``
            )
            .addField(
              `${GetLanguage("Episodes", config.language)}:`,
              `${episodeCount} ${GetLanguage(
                "EpisodesCount",
                config.language
              )}`,
              true
            )
            .addField(
              `${GetLanguage("EpisodeLength", config.language)}:`,
              `${episodeLength} ${GetLanguage("Minutes", config.language)}`,
              true
            )
            .addField(
              `${GetLanguage("TotalLength", config.language)}:`,
              `${totalLength} ${GetLanguage("Minutes", config.language)}`,
              true
            )
            .addField(
              `${GetLanguage("StartDate", config.language)}:`,
              `${startDate}`,
              true
            )
            .addField(
              `${GetLanguage("EndDate", config.language)}:`,
              `${endDate}`,
              true
            )
            .addField(
              `${GetLanguage("AgeRatingGuide", config.language)}:`,
              `${ageRatingGuide}`
            )
            .setColor(`RANDOM`)
            .setDescription(synopsis)
            .setThumbnail(smallPoster)
            .setFooter(
              GetLanguage("DataFrom", config.language).replaceAll(
                "{source}",
                "Kitsu API"
              )
            );
          if (searchResult.attributes.coverImage) {
            let coverImage = searchResult.attributes.coverImage.original;
            embed.setImage(coverImage);
          }
          message.reply({ embeds: [embed] });
        } //END if !searchresults
      }); //END searchManga
  }
}
