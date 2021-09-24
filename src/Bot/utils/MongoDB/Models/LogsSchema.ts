import mongoose from "mongoose";
interface LogsType {
  guildId: string;
  ChannelLogs: string;
  BoostLogs: string;
  MemberLogs: string;
  GuildLogs: string;
  MessageLogs: string;
  RolesLogs: string;
  VoiceChannelsLogs: string;
}
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
