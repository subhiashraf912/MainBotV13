import express from "express";
import DiscordClient from "../client/client";
import routes from "./routes";
import session from "express-session";
import DiscordOAuth2UserDetails from "../utils/types/DiscordOAuth2UserDetails";
import { deserializeSession } from "./sessions/deserializeSession";
import cookieParser from "cookie-parser";
declare module "express-session" {
  interface SessionData {
    user?: DiscordOAuth2UserDetails;
  }
}

declare module "express" {
  interface Request {
    user?: DiscordOAuth2UserDetails;
    client?: DiscordClient;
  }
}

const initExpress = (client: DiscordClient) => {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;

  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.COOKIE_SECRET_KEY!,
      name: "DISCORD_OAUTH2_SESSION_ID",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000 * 24,
      },
    })
  );
  app.use(deserializeSession);
  app.use("/api", routes(client));
  app.locals.client = client;
  app.listen(port, () => {
    console.log(`Backend API Server is running on the port "${port}"`);
  });
  return app;
};

export default initExpress;
