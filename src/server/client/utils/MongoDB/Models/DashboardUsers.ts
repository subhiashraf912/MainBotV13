import mongoose from "mongoose";
import DiscordOAuth2UserDetails from "../../../../../types/DiscordOAuth2UserDetails";

const DashboardUsers = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
    unique: true,
  },
  guilds: {
    type: Array,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
}).index({ expireAt: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model<DiscordOAuth2UserDetails>(
  "dashboard-users",
  DashboardUsers,
  "dashboard-users"
);
