import { Queue } from "distube";
import DiscordClient from "../client/client";
import getConfig from "../utils/constants/getConfig";
import GetLanguage from "../utils/Languages";
import DisTubeBaseEvent from "../utils/structures/DistubeBaseEvent";
export default class EmptyEvent extends DisTubeBaseEvent {
  constructor() {
    super("empty");
  }
  async run(client: DiscordClient, queue: Queue) {
    if (queue.textChannel) {
      const config = await getConfig(client, queue.textChannel.guild.id);
      queue.textChannel.send({
        content: GetLanguage("DisTubeEmptyEvent", config.language),
      });
    }
  }
}
