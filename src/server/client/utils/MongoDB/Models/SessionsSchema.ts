import mongoose from "mongoose";
import SessionType from "../../../../../types/SessionType";

const SessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
  },
  data: {
    type: String,
  },
}).index({ expireAt: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model<SessionType>(
  "sessions",
  SessionSchema,
  "sessions"
);
