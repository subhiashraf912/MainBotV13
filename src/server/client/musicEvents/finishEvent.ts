import { Queue } from "distube";
import DiscordClient from "../classes/client";
import getConfig from "../utils/constants/getConfig";
import GetLanguage from "../utils/Languages";
import DisTubeBaseEvent from "../utils/structures/DistubeBaseEvent";
export default class FinishEvent extends DisTubeBaseEvent {
  constructor() {
    super("finish");
  }
  async run(client: DiscordClient, queue: Queue) {
    if (queue.textChannel) {
      const config = await getConfig(client, queue.textChannel.guild.id);
      queue.textChannel.send({
        content: GetLanguage("DisTubeFinishQueueEvent", config.language),
      });
    }
  }
}
