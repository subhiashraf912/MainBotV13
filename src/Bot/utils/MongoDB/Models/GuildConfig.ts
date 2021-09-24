import mongoose from "mongoose";
import configType from "../../types/GuildConfig";

const guildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: false },
  clientId: { type: String, required: true, unique: false },
  levelMessageChannel: { type: String, required: false, unique: true },
  prefix: {
    type: String,
    required: true,
    unique: false,
  },
  language: {
    type: String,
    required: false,
    unique: false,
    default: "english",
  },
  muteRoleId: {
    type: String,
    required: false,
    unique: false,
  },
  minXpPerMessage: {
    type: Number,
    required: false,
    unique: false,
    default: 15,
  },
  maxXpPerMessage: {
    type: Number,
    required: false,
    unique: false,
    default: 30,
  },
  levelRoles: {
    type: Object,
    required: false,
    unique: false,
    default: {},
  },
  isLevelSystemEnabled: {
    type: Object,
    required: false,
    default: true,
    unique: false,
  },
  levelsChannels: {
    type: Array,
    required: false,
    default: [],
    unique: false,
  },
  voiceLevelsChannels: {
    type: Array,
    required: false,
    default: [],
    unique: false,
  },
  voiceLevelRoles: {
    type: Object,
    required: false,
    default: {},
    unique: false,
  },
  disabledCommands: {
    type: Object,
    required: false,
    default: {},
    unique: false,
  },
  commandRestricts: {
    type: Object,
    required: false,
    default: {},
    unique: false,
  },
  welcomeChannel: {
    type: String,
    required: false,
    default: null,
    unique: false,
  },
  welcomeImageBackground: {
    type: String,
    required: false,
    default: null,
    unique: false,
  },
  welcomeMessage: {
    type: String,
    required: false,
    default:
      "Welcome to {server-name}, {member-ping} hope you enjoy your stay! you're member {member-count}",
    unique: false,
  },
  memberJoinRoles: {
    type: Array,
    required: false,
    default: [],
    unique: false,
  },
  botJoinRoles: {
    type: Array,
    required: false,
    default: [],
    unique: false,
  },
  aiChatChannel: {
    type: String,
    required: false,
    default: null,
    unique: false,
  },
  serverStats: {
    type: Object,
    required: false,
    default: {
      channelsCount: null,
      rolesCount: null,
      memberCount: null,
      botCount: null,
    },
    unique: false,
  },
});

export default mongoose.model<configType>("Guild", guildSchema, "guilds");
