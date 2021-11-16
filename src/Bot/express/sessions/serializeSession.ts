import { Request } from "express";
import SessionsSchema from "../../utils/MongoDB/Models/SessionsSchema";
import DiscordOAuth2UserDetails from "../../utils/types/DiscordOAuth2UserDetails";
export async function serializeSession(
  req: Request,
  user: DiscordOAuth2UserDetails
) {
  req.session.user = user;
  req.user = user;
  const session = await SessionsSchema.create({
    sessionId: req.sessionID,
    expiresAt: req.session.cookie.expires,
    data: JSON.stringify(user),
  });
  return session;
}
