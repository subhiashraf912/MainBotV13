import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
const GenshinImpact = require("genshin-db");

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "genshin-character",
      category: "genshin impact",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const character = GenshinImpact.characters(args.join(" "));
    const config = await getConfig(client, message.guild?.id as string);
    if (!character) {
      message.reply({
        content: GetLanguage("CharacterNotFound", config.language),
      });
      return;
    }
    const embed = new MessageEmbed()
      .setTitle(character.title)
      .setDescription(character.description)
      .addField(
        `${GetLanguage("Name", config.language)}:`,
        character.name,
        true
      )
      .addField(
        `${GetLanguage("Stars", config.language)}:`,
        character.rarity,
        true
      )
      .addField(
        `${GetLanguage("Element", config.language)}:`,
        character.element,
        true
      )
      .addField(
        `${GetLanguage("Weapon", config.language)}:`,
        character.weapontype,
        true
      )
      .addField(
        `${GetLanguage("SubStat", config.language)}:`,
        character.substat,
        true
      )
      .addField(
        `${GetLanguage("Gender", config.language)}:`,
        character.gender,
        true
      )
      .addField(
        `${GetLanguage("Region", config.language)}:`,
        character.region,
        true
      )
      .addField(
        `${GetLanguage("Affiliation", config.language)}:`,
        character.affiliation,
        true
      )
      .addField(
        `${GetLanguage("Birthday", config.language)}:`,
        character.birthday,
        true
      )
      .addField(
        `${GetLanguage("Constellation", config.language)}:`,
        character.constellation,
        true
      )
      .addField(
        `${GetLanguage("TalentMaterial", config.language)}:`,
        character.talentmaterialtype,
        true
      )
      .setThumbnail(character.images.card)
      .setImage(character.images.cover1);
    message.reply({ embeds: [embed] });
  }
}
