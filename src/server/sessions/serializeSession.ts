import { Request } from "express";
import SessionsSchema from "../client/utils/MongoDB/Models/SessionsSchema";
import DiscordOAuth2UserDetails from "../../types/DiscordOAuth2UserDetails";
export async function serializeSession(
  req: Request,
  user: DiscordOAuth2UserDetails
) {
  //@ts-ignore
  req.session.user = user;
  //@ts-ignore
  req.user = user;
  const session = await SessionsSchema.create({
    sessionId: req.sessionID,
    expiresAt: req.session.cookie.expires,
    data: JSON.stringify(user),
  });
  return session;
}
