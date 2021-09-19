import DiscordClient from "../../client/client";
import DisTube from "distube";
import { SpotifyPlugin } from "@distube/spotify";
import { SoundCloudPlugin } from "@distube/soundcloud";

const initDistube = (client: DiscordClient) => {
  return new DisTube(client, {
    leaveOnEmpty: false,
    leaveOnFinish: false,
    leaveOnStop: false,
    savePreviousSongs: true,
    emitAddListWhenCreatingQueue: true,
    emitAddSongWhenCreatingQueue: true,
    plugins: [new SpotifyPlugin(), new SoundCloudPlugin()],
    customFilters: {
      "0.25": "asetrate=48000*0.25",
      "0.5": "asetrate=48000*0.50",
      "0.75": "asetrate=48000*0.75",
      "1": "asetrate=48000*1",
      "1.25": "asetrate=48000*1.25",
      "1.5": "asetrate=48000*1.50",
      "1.75": "asetrate=48000*1.75",
      "2": "asetrate=48000*2",
      nightcore: "asetrate=48000*1.15,aresample=48000",
    },
  });
};

export default initDistube;
