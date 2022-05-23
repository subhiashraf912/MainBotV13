import express, { Request, Response } from "express";
import next from "next";
import deserializeSession from "../sessions/deserializeSession";
import cookieParser from "cookie-parser";
import session from "express-session";
import routes from "../routes";
import DiscordClient from "../client/classes/client";

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3500;
const initServer = async (client: DiscordClient) => {
  const server = express();
  server.use(cookieParser());
  server.use(
    session({
      secret: "!@$@!BestPas$WorDTomak3MyA99S3cure-12@!#!",
      name: "DISCORD_OAUTH2_SESSION_ID",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000 * 24,
      },
    })
  );
  server.get("/aze", (req, res) => {
    res.send("aze baka");
  });
  server.use(deserializeSession(client));
  server.use("/api", routes(client));
  const app = next({ dev });

  const handle = app.getRequestHandler();
  await app.prepare();

  server.all("*", (req: Request, res: Response) => {
    handle(req, res);
  });
  server.listen(port, (err?: any) => {
    if (err) throw err;
    console.log(`> Ready on localhost:${port}`);
  });

  return server;
};

export default initServer;
