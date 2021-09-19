import { Queue, Song } from "distube";
import DiscordClient from "../client/client";
import DisTubeBaseEvent from "../utils/structures/DistubeBaseEvent";
export default class FinishSongEvent extends DisTubeBaseEvent {
  constructor() {
    super("finishSong");
  }
  async run(client: DiscordClient, queue: Queue, song: Song) {
    client.currentPlayingSong.get(queue.textChannel?.guild.id as string)
      ?.deletable &&
      client.currentPlayingSong
        .get(queue.textChannel?.guild.id as string)
        ?.delete();
  }
}
