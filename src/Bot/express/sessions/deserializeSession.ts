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
    console.log("Session Expired");
    await sessionDB.delete({
      sessionId,
    });
    console.log("session deleted");
  } else {
    console.log("Session not expired");
    const data = JSON.parse(sessionDB.data);
    req.user = data;
  }
  next();
}
