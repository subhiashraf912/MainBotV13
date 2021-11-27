import { Request, Response } from "express";
import cookieParser from "cookie-parser";
import SessionsSchema from "../client/utils/MongoDB/Models/SessionsSchema";
import DiscordClient from "../client/classes/client";
export default (client: DiscordClient) => {
  return async function deserializeSession(
    req: Request,
    res: Response,
    next: Function
  ) {
    const { DISCORD_OAUTH2_SESSION_ID } = req.cookies;
    if (!DISCORD_OAUTH2_SESSION_ID) return next();
    const sessionId = cookieParser
      .signedCookie(
        DISCORD_OAUTH2_SESSION_ID,
        "!@$@!BestPas$WorDTomak3MyA99S3cure-12@!#!"
      )
      .toString();
    const sessionDB = await SessionsSchema.findOne({
      sessionId,
    });
    if (!sessionDB) return next();
    const currentTime = new Date();
    if (sessionDB.expiresAt < currentTime) {
      await sessionDB.delete({
        sessionId,
      });
    } else {
      const data = JSON.parse(sessionDB.data);
      //@ts-ignore
      req.user = data;
      //@ts-ignore
      req.client = client;
    }
    next();
  };
};
