import DistubeBaseEvent from "../utils/structures/DistubeBaseEvent";
import { Queue } from "distube";
import DiscordClient from "../classes/client";
export default class InitQueueEvent extends DistubeBaseEvent {
  constructor() {
    super("initQueue");
  }
  async run(client: DiscordClient, queue: Queue) {
    queue.autoplay = false;
    queue.volume = client.queueVolume;
  }
}
