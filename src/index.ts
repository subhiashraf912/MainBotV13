import dotenv from 'dotenv';
dotenv.config();
import './Bot/app';


/**
import { bots } from "../configs.json";

import processManager from "pm2";

const mongodb =
  "mongodb+srv://admin:4Z12t2TYyBQGdPmT@hentai.klm1z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
bots.forEach((element) => {
  const array = element.split(" ");
  const botName = array[0];
  const botPrefix = array[1];
  const botToken = array[2];
  const mainOwner = array[3];
  processManager.start(
    {
      name: botName,
      script: "dist/src/Bot/app.js",
      env: {
        BOT_TOKEN: botToken,
        BOT_PREFIX: botPrefix,
        BOT_MONGODB: mongodb,
        MAIN_OWNER: mainOwner,
      },
    },
    function (err, apps) {
      if (err) {
        console.error(err);
        return processManager.disconnect();
      } else {
        console.log(`${botName} is Running!`);
      }
    }
  );
});

*/