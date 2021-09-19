import { Guild } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";
import getConfig from "../utils/constants/getConfig";

export default class GuildCreateEvent extends BaseEvent {
  constructor() {
    super("guildCreate");
  }

  async run(client: DiscordClient, guild: Guild) {
    await getConfig(client, guild.id);
  }
}
