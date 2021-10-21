import { Client, ClientOptions, Collection, Message, User } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import BaseCommand from "../utils/structures/BaseCommand";
import {
  registerCommands,
  registerDistubeEvents,
  registerEvents,
  registerSlashCommands,
} from "../utils/registry";
import InitDistube from "../utils/Initlizers/InitDistube";
import DisTube from "distube";
import init from "../utils/MongoDB/mongoose";
import BaseSlashCommand from "../utils/structures/BaseSlashCommand";
import getOwners from "../utils/constants/getOwners";
import RankType from "../utils/types/RankType";
import GiveawaysBase from "../utils/Initlizers/GiveawaysBase";
import { RankBackgroundType } from "../utils/types/RankBackgroundType";
import VoiceRankType from "../utils/types/VoiceRankType";
import LogsType from "../utils/types/Logs.Interface";
type startOptionsType = {
  token: string;
  commandsPath: string;
  eventsPath: string;
  musicManagerEventsPath: string;
  mongoDbURI: string;
  slashCommandsPath: string;
};
type configType = {
  guildId: string;
  clientId: string;
  prefix: string;
};

export default class DiscordClient extends Client {
  private _mainPrefix = process.env.BOT_PREFIX;
  private _mainOwner = process.env.MAIN_OWNER;
  private _token = process.env.BOT_TOKEN;
  private _mongodb = process.env.BOT_MONGODB;
  private _commands = new Collection<string, BaseCommand>();
  private _slashCommands = new Collection<string, BaseSlashCommand>();
  private _events = new Collection<string, BaseEvent>();
  private _ranks = new Collection<string, RankType>();
  private _aliases = new Collection<string, string>();
  private _rankBackgrounds = new Collection<string, RankBackgroundType>();
  private _distubeEvents = new Collection<string, BaseEvent>();
  private _configs = new Collection<string, configType>();
  private _voiceRanks = new Collection<string, VoiceRankType>();
  private _distube: DisTube = InitDistube(this);
  private _logs = new Collection<string, LogsType>();
  private _mongoose = init;
  private _currentPlayingSong = new Collection<string, Message>();
  private _owners = new Collection<string, User>();
  private _queueVol = 100;
  private _giveawaysManager: GiveawaysBase = new GiveawaysBase(this, {
    updateCountdownEvery: 10000,
    default: {
      botsCanWin: false,
      exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
      embedColor: "#FF0000",
      embedColorEnd: "#000000",
      reaction: "🎉",
    },
  });

  constructor(options: ClientOptions) {
    super(options);
    if (!this._mainOwner)
      throw new Error(
        "You need to pass the main owner in the env variables, use MAIN_OWNER variable for it."
      );
    if (!this._mainPrefix)
      throw new Error(
        "You need to pass the main prefix in the env variables, use MAIN_PREFIX variable for it."
      );
    if (!this._token)
      throw new Error(
        "You need to pass the bot token in the env variables, use BOT_TOKEN variable for it."
      );
    if (!this._mongodb)
      throw new Error(
        "You need to pass the mongodb url in the env variables, use BOT_MONGODB variable for it."
      );
  }

  async regCommands(path: string) {
    registerCommands(this, path);
  }

  async regEvents(path: string) {
    registerEvents(this, path);
  }
  async regMusicEvents(path: string) {
    registerDistubeEvents(this, path);
  }
  async regSlashCommands(path: string) {
    registerSlashCommands(this, path);
  }
  async start(options: startOptionsType) {
    await this.initMongoose(options.mongoDbURI);
    await this.regCommands(options.commandsPath);
    await this.regEvents(options.eventsPath);
    await this.regMusicEvents(options.musicManagerEventsPath);
    await this.regSlashCommands(options.slashCommandsPath);
    await this.login(options.token);
    await getOwners(this);
  }
  async initMongoose(MongoDBURI: string) {
    return this._mongoose(MongoDBURI);
  }

  get giveawaysManager(): GiveawaysBase {
    return this._giveawaysManager;
  }
  get commands(): Collection<string, BaseCommand> {
    return this._commands;
  }
  get queueVolume(): number {
    return this._queueVol;
  }
  get ranks(): Collection<string, RankType> {
    return this._ranks;
  }
  set queueVolume(value: number) {
    this._queueVol = value;
  }
  get owners(): Collection<string, User> {
    return this._owners;
  }
  get slashCommands(): Collection<string, BaseSlashCommand> {
    return this._slashCommands;
  }
  get events(): Collection<string, BaseEvent> {
    return this._events;
  }
  get aliases(): Collection<string, string> {
    return this._aliases;
  }
  get distubeEvents(): Collection<string, BaseEvent> {
    return this._distubeEvents;
  }

  get configs(): Collection<string, configType> {
    return this._configs;
  }

  get distube(): DisTube {
    return this._distube;
  }

  get currentPlayingSong(): Collection<string, Message> {
    return this._currentPlayingSong;
  }
  get mainPrefix(): string {
    return this._mainPrefix as string;
  }
  get rankBackgrounds(): Collection<string, RankBackgroundType> {
    return this._rankBackgrounds;
  }
  get voiceRanks(): Collection<string, VoiceRankType> {
    return this._voiceRanks;
  }
  get LogsConfig(): Collection<string, LogsType> {
    return this._logs;
  }
}
