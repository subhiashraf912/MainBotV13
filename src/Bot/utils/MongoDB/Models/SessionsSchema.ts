import mongoose from "mongoose";
import SessionType from "../../../api/types/SessionType";

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
});

export default mongoose.model<SessionType>(
  "sessions",
  SessionSchema,
  "sessions"
);
