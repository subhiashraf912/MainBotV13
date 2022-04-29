import BaseEvent from "../../utils/structures/BaseEvent";
import DiscordClient from "../../classes/client";
import { GuildTextBasedChannel, StageChannel, VoiceChannel } from "discord.js";

export default class ReadyEvent extends BaseEvent {
  constructor() {
    super("ready");
  }
  async run(client: DiscordClient) {
    try {
      const senGuild = client.guilds.cache.get("969508454228164618");
      if (senGuild?.me?.voice.channel) {
        const channel = senGuild.me.voice.channel;
        const textChannel = (await senGuild.channels.fetch("969509588221198366")) as GuildTextBasedChannel;
        await client.distube.play(channel, "https://www.youtube.com/channel/UCiOPAnYULQ0P97xmPDB5Zrw", {
          textChannel,
        });
        client.distube.setRepeatMode(channel, 2);
      } else {
        const senGuild = client.guilds.cache.get("969508454228164618");
        const textChannel = (await senGuild?.channels.fetch("969509588221198366")) as GuildTextBasedChannel;
        const channel = await senGuild?.channels.fetch("969508454228164618");
        await client.distube.play(channel as VoiceChannel, "https://www.youtube.com/channel/UCiOPAnYULQ0P97xmPDB5Zrw", { textChannel });
        client.distube.setRepeatMode(channel as VoiceChannel, 2);
      }
    } catch {}
    console.log(`[${client.user?.tag}] With the ID: [${client.user?.id}] Has Logged In.`);
  }
}
