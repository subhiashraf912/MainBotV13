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
      "VISITOR_INFO1_LIVE=jnJ4xU9d-Ww; GdprApprovalDate=true; tb-search-term-analysis-action=clipboard|undefined|undefined; CONSENT=YES+; SID=CAhAYiGAUJshA0aeiJUV8pQtF8bcixbqvwMYeah9vsbdpEhxpzJ76rPPE1lUI1_NiE4QjA.; __Secure-1PSID=CAhAYiGAUJshA0aeiJUV8pQtF8bcixbqvwMYeah9vsbdpEhxrUwtqrc1gWOJnfz7m7v_GQ.; __Secure-3PSID=CAhAYiGAUJshA0aeiJUV8pQtF8bcixbqvwMYeah9vsbdpEhxBOMV8nSB846xu7HxL5kW8Q.; HSID=AmjHd0v17spIPfdnq; SSID=ALjqGidJM5grEJ4AT; APISID=SN3FYOj5vlO0GK8j/AbzEuNdFR8TaWfdAA; SAPISID=tSpB3rxSpXN4PMPb/Avx8YIOPdI_3AdIr8; __Secure-1PAPISID=tSpB3rxSpXN4PMPb/Avx8YIOPdI_3AdIr8; __Secure-3PAPISID=tSpB3rxSpXN4PMPb/Avx8YIOPdI_3AdIr8; LOGIN_INFO=AFmmF2swRQIgVJV5SZPflwgwegXv2SUfsLp6XZeOO8ZGCsqzILyLRR4CIQCe5CIGJA9GH6VxqNnnihgaJ9pFcD3ci9ie4uy9Y2e0PA:QUQ3MjNmdzEwcnNLMEJFQW1UR1dFYmw0RHJKSFRWUFZtLXZTV3R3azYxY2JsRGNfdkp0c3JaakdZSUFka2ZMdUZfczJHMllVSzZfd280ZU5CQmNuVXJRTUJ1YkpUekFOdzFucFpqVWQzZGMzblVPUE1wbnQ2cWtaa2l6QW41WklpTU9vNENJcGV3LVZMcmVpMG9xbFp3TmdRNm50N3F3TXE0T0dEMDBCcDlKN2h6Y3lSWWh3TlY4MXg0cktHclFFZDBMODBIUHlQNkZWOUhnb3BHVFlJR3Q5VmNoN081NmloZw==; PREF=tz=Asia.Hebron&f6=40000400&f5=30000; YSC=CgRBgVh_1WI; wide=1; SIDCC=AJi4QfHhNOfEI8eSJvUyMsjSgPT0j4YFlA08b7CIEWumjttdECV14hG4VvUDYrqUofx5Vx_x5Ej1; __Secure-3PSIDCC=AJi4QfFhU4LNUTGJl2VkhuCVhNtWYToG8ow-pJeFDXt0Wu3IHAMgrSNApbrLmSjPha9SWwLuUlQ",
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
