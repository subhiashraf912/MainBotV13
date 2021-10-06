import mongoose from "mongoose";
interface giveawaySchema {
  messageID: String;
  channelID: String;
  guildID: String;
  startAt: Number;
  endAt: Number;
  ended: Boolean;
  winnerCount: Number;
  prize: String;
  messages: {
    giveaway: String;
    giveawayEnded: String;
    inviteToParticipate: String;
    timeRemaining: String;
    winMessage: String;
    embedFooter: String;
    noWinner: String;
    winners: String;
    endedAt: String;
    hostedBy: String;
    units: {
      seconds: String;
      minutes: String;
      hours: String;
      days: String;
      pluralS: Boolean;
    };
  };
  hostedBy: String;
  winnerIDs: [String];
  reaction: mongoose.Schema.Types.Mixed;
  botsCanWin: Boolean;
  embedColor: mongoose.Schema.Types.Mixed;
  embedColorEnd: mongoose.Schema.Types.Mixed;
  exemptPermissions: [];
  exemptMembers: String;
  bonusEntries: String;
  extraData: mongoose.Schema.Types.Mixed;
  lastChance: {
    enabled: Boolean;
    content: String;
    threshold: Number;
    embedColor: mongoose.Schema.Types.Mixed;
  };
}

export default giveawaySchema;
