import { Queue } from "distube";
import DiscordClient from "../classes/client";
import DisTubeBaseEvent from "../utils/structures/DistubeBaseEvent";
export default class PlaySongEvent extends DisTubeBaseEvent {
  constructor() {
    super("deleteQueue");
  }
  async run(client: DiscordClient, queue: Queue) {}
}
