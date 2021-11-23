import dotenv from "dotenv";
dotenv.config();
import DiscordClient from "./client/classes/client";
import intents from "./client/utils/constants/clientIntents";
import partials from "./client/utils/constants/clientPartials";

declare module "express" {
  interface Request {
    user?: DiscordOAuth2UserDetails;
    client?: DiscordClient;
  }
}

declare module "express-session" {
  interface SessionData {
    user?: DiscordOAuth2UserDetails;
  }
}

const client = new DiscordClient({
  intents,
  partials,
  allowedMentions: {
    repliedUser: false,
  },
});
import config from "./client/config.json";
import youtubeNotifications from "./client/utils/Modules/youtube-notification-module";
import DiscordOAuth2UserDetails from "../types/DiscordOAuth2UserDetails";

(async () => {
  new youtubeNotifications(client).init();
  await client.start({
    commandsPath: "../commands",
    // youtubeEventsPath:"../YoutubeEvents",
    eventsPath: "../events",
    musicManagerEventsPath: "../musicEvents",
    token: process.env.BOT_TOKEN || config.token,
    mongoDbURI: process.env.BOT_MONGODB || config.mongodb,
    slashCommandsPath: "../slashCommands",
  });
})();
