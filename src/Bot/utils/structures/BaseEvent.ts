import { ClientEvents } from "discord.js";
import DiscordClient from "../../client/client";

export default abstract class BaseEvent {
  constructor(private name: keyof ClientEvents) {}

  getName(): keyof ClientEvents {
    return this.name;
  }
  abstract run(client: DiscordClient, ...args: any): void;
}
