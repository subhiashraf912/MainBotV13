type configType = {
  guildId: string;
  clientId: string;
  prefix: string;
  levelMessageChannel: string | null;
  language: string;
  muteRoleId: string;
  minXpPerMessage: number;
  maxXpPerMessage: number;
  levelRoles: object;
  isLevelSystemEnabled: boolean;
  levelsChannels: string[];
  voiceLevelsChannels: string[];
  voiceLevelRoles: object;
  disabledCommands: any;
  commandRestricts: any;
  welcomeChannel: string | null;
  welcomeImageBackground: string | null;
  welcomeMessage: string;
  memberJoinRoles: string[];
  botJoinRoles: string[];
  aiChatChannel: string | null;
  serverStats: {
    channelsCount: string | null;
    rolesCount: string | null;
    memberCount: string | null;
    botCount: string | null;
  }
}
export default configType;
