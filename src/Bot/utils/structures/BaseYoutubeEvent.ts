import DiscordClient from "../../client/client";
type events = "video";
export default abstract class BaseYoutubeEvent {
  constructor(private name: events) {}

  getName(): events {
    return this.name;
  }
  abstract run(client: DiscordClient, ...args: any): void;
}
