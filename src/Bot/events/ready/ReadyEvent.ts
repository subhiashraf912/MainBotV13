import BaseEvent from "../../utils/structures/BaseEvent";
import DiscordClient from "../../client/client";
import { StageChannel, VoiceChannel } from "discord.js/typings/index.js";

export default class ReadyEvent extends BaseEvent {
  constructor() {
    super("ready");
  }
  async run(client: DiscordClient) {
    try {
      const senGuild = client.guilds.cache.get("783991881028993045");
      if (senGuild?.me?.voice.channel) {
        const channel = senGuild.me.voice.channel;
        client.distube.playVoiceChannel(
          channel,
          "https://www.youtube.com/channel/UCiOPAnYULQ0P97xmPDB5Zrw"
        );
        client.distube.setRepeatMode(channel);
        client.distube.setRepeatMode(channel);
      } else {
        const channel = await senGuild?.channels.fetch("895340582032007219");
        client.distube.playVoiceChannel(
          channel as StageChannel,
          "https://www.youtube.com/channel/UCiOPAnYULQ0P97xmPDB5Zrw"
        );
        client.distube.setRepeatMode(channel as StageChannel);
        client.distube.setRepeatMode(channel as StageChannel);
      }
    } catch {}
    console.log(
      `[${client.user?.tag}] With the ID: [${client.user?.id}] Has Logged In.`
    );
  }
}
