import mongoose from "mongoose";
import LogsType from "../../types/Logs.Interface";

let Schema = new mongoose.Schema({
  guildId: String,
  ChannelLogs: String,
  BoostLogs: String,
  MemberLogs: String,
  GuildLogs: String,
  MessageLogs: String,
  RolesLogs: String,
  VoiceChannelsLogs: String,
});
export default mongoose.model<LogsType>("Logs", Schema);
