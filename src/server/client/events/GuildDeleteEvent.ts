import { Guild } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../classes/client";
import deleteConfig from "../utils/constants/deleteConfig";

export default class GuildDeleteEvent extends BaseEvent {
  constructor() {
    super("guildDelete");
  }

  async run(client: DiscordClient, guild: Guild) {
    await deleteConfig(client, guild.id);
  }
}
