// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelDelete
import { DMChannel, GuildChannel } from "discord.js";
import BaseEvent from "../../utils/structures/BaseEvent";
import DiscordClient from "../../classes/client";

export default class ChannelDeleteEvent extends BaseEvent {
  constructor() {
    super("channelDelete");
  }

  async run(client: DiscordClient, channel: DMChannel | GuildChannel) {
    if (channel.type === "DM") return;
    const config = client.configs.get(channel.guild.id);
    if (!config) return;
    const { serverStats } = config;
    const { channelsCount } = serverStats;
    if (!channelsCount) return;
    const c = channel.guild.channels.cache.get(channelsCount);
    if (c) {
      c.setName(`Channels Count: ${c.guild.channels.cache.size}`);
    }
  }
}
