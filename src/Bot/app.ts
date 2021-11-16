import DiscordClient from "./client/client";
import intents from "./utils/constants/clientIntents";
import partials from "./utils/constants/clientPartials";
const client = new DiscordClient({
  intents,
  partials,
  allowedMentions: {
    repliedUser: false,
  },
});
import config from "./config.json";
import youtubeNotifications from "./utils/Modules/youtube-notification-module";

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
