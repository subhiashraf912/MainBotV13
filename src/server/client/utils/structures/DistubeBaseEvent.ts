import DiscordClient from "../../classes/client";

export default abstract class DistubeBaseEvent {
  constructor(private name: distubeEvents) {}

  getName(): distubeEvents {
    return this.name;
  }
  abstract run(client: DiscordClient, ...args: any): void | Promise<void>;
}

type distubeEvents =
  | "addList"
  | "addSong"
  | "playSong"
  | "finishSong"
  | "empty"
  | "finish"
  | "initQueue"
  | "noRelated"
  | "disconnect"
  | "deleteQueue"
  | "error"
  | "searchNoResult"
  | "searchCancel"
  | "searchResult"
  | "searchInvalidAnswer"
  | "searchDone";
