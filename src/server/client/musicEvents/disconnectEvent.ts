import { Queue } from "distube";
import DiscordClient from "../classes/client";
import DisTubeBaseEvent from "../utils/structures/DistubeBaseEvent";
export default class DisconnectEvent extends DisTubeBaseEvent {
  constructor() {
    super("disconnect");
  }
  async run(client: DiscordClient, queue: Queue) {}
}
