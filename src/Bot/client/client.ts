import { Client, ClientOptions, Collection, Message, User } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import BaseCommand from "../utils/structures/BaseCommand";
import {
  registerCommands,
  registerDistubeEvents,
  registerEvents,
  registerNonPrefixedCommands,
  registerSlashCommands,
} from "../utils/registry";
import InitDistube from "../utils/Initlizers/InitDistube";
import DisTube from "distube";
import init from "../utils/MongoDB/mongoose";
import BaseSlashCommand from "../utils/structures/BaseSlashCommand";
import getOwners from "../utils/constants/getOwners";
type startOptionsType = {
  token: string;
  commandsPath: string;
  eventsPath: string;
  musicManagerEventsPath: string;
  mongoDbURI: string;
  nonPrefixedCommandsPath: string;
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
  private _nonPrefixedCommands = new Collection<string, BaseCommand>();
  private _events = new Collection<string, BaseEvent>();
  private _aliases = new Collection<string, string>();
  private _nonPrefixedCommandsAliases = new Collection<string, string>();
  private _distubeEvents = new Collection<string, BaseEvent>();
  private _configs = new Collection<string, configType>();
  private _distube: DisTube = InitDistube(this);
  private _mongoose = init;
  private _currentPlayingSong = new Collection<string, Message>();
  private _owners = new Collection<string, User>();
  private _queueVol = 50;
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

  async regNonPrefixedCommands(path: string) {
    registerNonPrefixedCommands(this, path);
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
    await this.regNonPrefixedCommands(options.nonPrefixedCommandsPath);
    await this.regEvents(options.eventsPath);
    await this.regMusicEvents(options.musicManagerEventsPath);
    await this.regSlashCommands(options.slashCommandsPath);
    await this.login(options.token);
    await getOwners(this);
  }
  async initMongoose(MongoDBURI: string) {
    return this._mongoose(MongoDBURI);
  }

  get commands(): Collection<string, BaseCommand> {
    return this._commands;
  }
  get queueVolume(): number {
    return this._queueVol;
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
  get nonPrefixedCommands(): Collection<string, BaseCommand> {
    return this._nonPrefixedCommands;
  }
  get nonPrefixedCommandsAliases(): Collection<string, string> {
    return this._nonPrefixedCommandsAliases;
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
}
