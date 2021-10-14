import mongoose from "mongoose";

const NCVotesSchema = new mongoose.Schema({
  guildId: { type: String },
  rice: {
    type: Array,
    required: false,
    unique: false,
    default: [],
  },
  bloomingnightcore: {
    type: Array,
    required: false,
    unique: false,
    default: [],
  },
  senpai: {
    type: Array,
    required: false,
    unique: false,
    default: [],
  },
  shizu: {
    type: Array,
    required: false,
    unique: false,
    default: [],
  },
  gamechanger: {
    type: Array,
    required: false,
    unique: false,
    default: [],
  },
});

type ncVotesType = {
  rice: string[];
  bloomingnightcore: string[];
  senpai: string[];
  shizu: string[];
  gamechanger: string[];
  guildId: string;
};

export default mongoose.model<ncVotesType>(
  "nc-votes",
  NCVotesSchema,
  "nc-votes"
);
