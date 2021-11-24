import { InviteTargetType } from "discord-api-types";
import {
  Client,
  Guild,
  GuildChannel,
  IntegrationApplication,
  InviteGuild,
  InviteStageInstance,
  PartialGroupDMChannel,
  User,
} from "discord.js";

export default class invite {
  uses;
  channel;
  client;
  code;
  createdAt;
  createdTimestamp;
  deletable;
  expiresAt;
  expiresTimestamp;
  guild;
  inviter;
  maxAge;
  maxUses;
  memberCount;
  presenceCount;
  stageInstance;
  targetApplication;
  targetType;
  targetUser;
  temporary;

  constructor(options: inviteOptions) {
    this.channel = options.channel;
    this.client = options.client;
    this.code = options.code;
    this.createdAt = options.createdAt;
    this.createdTimestamp = options.createdTimestamp;
    this.deletable = options.deletable;
    this.expiresAt = options.expiresAt;
    this.expiresTimestamp = options.expiresTimestamp;
    this.guild = options.guild;
    this.inviter = options.inviter;
    this.maxAge = options.maxAge;
    this.maxUses = options.maxUses;
    this.memberCount = options.memberCount;
    this.presenceCount = options.presenceCount;
    this.stageInstance = options.stageInstance;
    this.targetApplication = options.targetApplication;
    this.targetType = options.targetType;
    this.targetUser = options.targetUser;
    this.temporary = options.temporary;
    this.uses = options.uses;
  }
}

interface inviteOptions {
  channel: GuildChannel | PartialGroupDMChannel;
  client: Client;
  code: string;
  createdAt: Date | null;
  createdTimestamp: number | null;
  deletable: boolean;
  expiresAt: Date | null;
  expiresTimestamp: number | null;
  guild: Guild | InviteGuild | null;
  inviter: User | null;
  maxAge: number | null;
  maxUses: number | null;
  memberCount: number;
  presenceCount: number;
  stageInstance: InviteStageInstance | null;
  targetApplication: IntegrationApplication | null;
  targetType: InviteTargetType | null;
  targetUser: User | null;
  temporary: boolean | null;
  uses: number | null;
}
