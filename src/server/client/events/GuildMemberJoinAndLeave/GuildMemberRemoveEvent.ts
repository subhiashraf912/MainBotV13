import { GuildMember } from "discord.js";
import BaseEvent from "../../utils/structures/BaseEvent";
import DiscordClient from "../../classes/client";

export default class GuildMemberRemoveEvent extends BaseEvent {
  constructor() {
    super("guildMemberRemove");
  }

  async run(client: DiscordClient, member: GuildMember) {}
}
