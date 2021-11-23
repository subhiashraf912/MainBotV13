import DiscordClient from "../../classes/client";
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
    youtubeCookie:
      "VISITOR_INFO1_LIVE=PS0rgeMrgy4; tb-search-term-analysis-action=clipboard|undefined|undefined; SID=DwhAYhwhjO-BBFN0oYihbd8d0erwYMH4ua6aWwPf-hxn8GJ9yW8fclhdaplsbt9pv6fbqA.; __Secure-1PSID=DwhAYhwhjO-BBFN0oYihbd8d0erwYMH4ua6aWwPf-hxn8GJ9vZhUtqcV6m-ZteCSYvwpEw.; __Secure-3PSID=DwhAYhwhjO-BBFN0oYihbd8d0erwYMH4ua6aWwPf-hxn8GJ9942BvfovAp14Ze_YNi-onQ.; HSID=Aq5-MnKGC35BXn5UL; SSID=Aw_5W6Dd2kfBQ5rqn; APISID=0JEkKVR0UYteHDUf/As1oyWq_AYtdubW9A; SAPISID=WkdcPK0JF1OaTolc/ArDtc1LG_qbYNbGe1; __Secure-1PAPISID=WkdcPK0JF1OaTolc/ArDtc1LG_qbYNbGe1; __Secure-3PAPISID=WkdcPK0JF1OaTolc/ArDtc1LG_qbYNbGe1; LOGIN_INFO=AFmmF2swRAIgH-e3WtjqSHiC7e1jBh0Us2dmMvmyrWZFw7sAFacRGsUCIDnCH5_FMuyvYpKz6IGbuQW0r_Jgi7AYAmmd5UyYbmvL:QUQ3MjNmek9CaFc2WGU1QUlZZDRMVFd3Q0U3UnBvemRwbml0SnJ1RG9PMUgxTEw0UXhzYVU4d3J5QkdEcWxxa0hlQ0diLWRGYkVLZmNiX1lLMmdkeUVtV2ZQNmVNcldvaXo2UXdvb2ZHeldlNDNzX1NLcXpwYUhha1JvaTQ4b2RHbDctU1VHNE9WMGYzWlQyeEdEcWJBR1JHUDZBMnlxZl9WdmQ1RlJpd2pnWkxpZzl3bUNyU3hlQjFFXzA3QUNGWUlTOUxzRFM0MTZxSTQ2dU1SSnhmUjJ3c2NxNGM4R2tydw==; PREF=tz=Asia.Hebron&f6=40000000&f4=4000000; YSC=U4ksz4-3TSw; SIDCC=AJi4QfHDXqFfRdL9AB92Hm4QzRcdiMvHKGXvigTIANmo4K7z_moPhUC_Eum-r3Yt90Axg7Uocg4; __Secure-3PSIDCC=AJi4QfG7_d-NwGKrjUfXhPxW4YrfCZpHUs3xwwEXK9I0RvkNMecqvWBwmgSEvcEzQt9P2oftBw",
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
