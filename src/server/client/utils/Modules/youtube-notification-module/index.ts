import { TypedEmitter } from "tiny-typed-emitter";
import ytpl from "@distube/ytpl";
import ytdl from "ytdl-core";
import ytsr from "@distube/ytsr";
import DiscordClient from "../../../classes/client";
export default class youtubeNotifications extends TypedEmitter {
  client;
  constructor(client: DiscordClient) {
    super();
    this.client = client;
  }

  async init() {
    // setInterval(async () => {
    // 	const result = await ytpl("UCvb-GMExpIyVX7_pIij6Cog", { limit: 1 });
    // 	// console.log(result.items[0])
    // 	const latestVid =  (await ytdl.getInfo(result.items[0].id)).videoDetails.publishDate
    // 	console.log(latestVid)
    // }, 5000);
  }
}
