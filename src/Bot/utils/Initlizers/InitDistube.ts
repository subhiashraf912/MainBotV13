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
    youtubeCookie:
      "GdprApprovalDate=true; tb-search-term-analysis-action=clipboard|undefined|undefined; VISITOR_INFO1_LIVE=K0mNjgZfvf0; SID=CwhAYnmGUEEtDgfOvF0YUSBtN6u1Koszz2xD2997I_8_fvTzqG1ov5OZTjZrSZCX534oXA.; __Secure-1PSID=CwhAYnmGUEEtDgfOvF0YUSBtN6u1Koszz2xD2997I_8_fvTzinu8fFzs8_SsoM-RhpqF6g.; __Secure-3PSID=CwhAYnmGUEEtDgfOvF0YUSBtN6u1Koszz2xD2997I_8_fvTzIG5elM6Fli97AJeu5qS2tw.; HSID=A8fcopWH0xwtS6tev; SSID=AUqc6DoXBRiAZUuIs; APISID=edPf8bhtCl_olUGR/ApfldL9QZZn43bFv2; SAPISID=cXbTp8Q6TpKJOwvt/AgwnvkzWGWe1ekP1X; __Secure-1PAPISID=cXbTp8Q6TpKJOwvt/AgwnvkzWGWe1ekP1X; __Secure-3PAPISID=cXbTp8Q6TpKJOwvt/AgwnvkzWGWe1ekP1X; LOGIN_INFO=AFmmF2swRgIhAJxb_hWAsObQHffaZCeNcUZkhVuKHzyC1fBTcU7hjEjkAiEAvv5mxTMlE1iQkhDFSDtQXLkBVYLyDxzAcnWwzm6zGEI:QUQ3MjNmdzUxN0d0bXJUVHB3bTktaUFBZzhadVh1SWRsSFBqNm5IbE5hUVJMUXZucUtnWVN5S0xaOEo2TnlhdjM3blFPUjk1WHptLTFVVmo5NEVmWF9qNUd6MjYzeVp2ZXBfUkc1bWRldWx0Wkt4TWd0WXo2M0FLcGw3b1BDcmtEbXplQ2o0dDZLektVaHAtS1FQTzdyYk1ST2w4WTdVUkJHbFFIX3pRYzJGQWdLNm9WZG5sTjQ5bnc3aEI4ck43anJHVW80aXBTTnlqVnF6Z1JzcnJpOFFVLXVZZ0NIVm1Ddw==; PREF=tz=Asia.Hebron&f6=40000400&f5=20000; CONSENT=YES+; YSC=EE0OCNiE_1A; SIDCC=AJi4QfH0XZGdMjnFkrloxhFwTQKPtCBXqR0i-hNWjYFwlBTUiAIfkkdiMrFpWxtklsh8FZV2HLY; __Secure-3PSIDCC=AJi4QfHgaThRYaY_Tj65dOE4kggc39ys3Kf_0sHlXvh7fz4ZzVtn0KANKwbEM9lymmQHTmHpSg",
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
}

export default initDistube;
