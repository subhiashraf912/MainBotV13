import { Request, Response } from "express";
import cookieParser from "cookie-parser";
import SessionsSchema from "../../utils/MongoDB/Models/SessionsSchema";
export async function deserializeSession(
  req: Request,
  res: Response,
  next: Function
) {
  const { DISCORD_OAUTH2_SESSION_ID } = req.cookies;
  if (!DISCORD_OAUTH2_SESSION_ID) return next();
  const sessionId = cookieParser
    .signedCookie(DISCORD_OAUTH2_SESSION_ID, process.env.COOKIE_SECRET_KEY!)
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
    req.user = data;
  }
  next();
}
