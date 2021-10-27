import { VoiceChannel } from "discord.js";
import express from "express";
import DiscordClient from "../client/client";
import { registerGetRoutes } from "../utils/registry";

const initExpress = (client: DiscordClient) => {
  const app = express();
  registerGetRoutes(client, "../express/routes/get");
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
  app.use("music/play/:guild/:channel/:song", async (req, res) => {
    const { guild, channel, song } = req.params;
    if (!guild || !client.guilds.cache.get(guild)) {
      res.status(400).send({ message: "Guild is required" });
      return {};
    }
    if (
      !channel ||
      !client.guilds.cache.get(guild)?.channels.cache.get(channel)
    ) {
      res.status(400).send({ message: "Channel is required" });
      return {};
    }
    if (!song) {
      res.status(400).send({ message: "Song is required" });
      return {};
    }
    const channelObj = client.channels.cache.get(channel);
    if (!(channelObj instanceof VoiceChannel)) {
      res.status(400).send({
        message: "Channel should be a voice channel",
      });
      return {};
    }
    try {
      await client.distube.playVoiceChannel(channelObj, song);
      res.status(200).send("Playing song");
    } catch (err: any) {
      res.status(400).send({ error: err.message });
    }
    return {};
  });
  app.listen(port, () => {
    console.log(`Our app is running on port ${port}`);
  });
  return app;
};
export default initExpress;
