import {
  Message,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
const akinator = require("discord.js-akinator");


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


    const language = "en"; //The Language of the Game
const childMode = false; //Whether to use Akinator's Child Mode
const gameType = "character"; //The Type of Akinator Game to Play. ("animal", "character" or "object")
const useButtons = true; //Whether to use Discord's Buttons
const embedColor = "#1F1E33"; //The Color of the Message Embeds


    akinator(message, {
      language: language, //Defaults to "en"
      childMode: childMode, //Defaults to "false"
      gameType: gameType, //Defaults to "character"
      useButtons: useButtons, //Defaults to "false"
      embedColor: embedColor //Defaults to "RANDOM"
    });
  }
}
