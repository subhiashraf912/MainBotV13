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

(async () => {
  await client.start({
    commandsPath: "../commands",
    eventsPath: "../events",
    musicManagerEventsPath: "../musicEvents",
    token: process.env.BOT_TOKEN as string,
    mongoDbURI: process.env.BOT_MONGODB as string,
    slashCommandsPath: "../slashCommands",
  });
})();
