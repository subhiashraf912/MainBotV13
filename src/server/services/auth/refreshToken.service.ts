import { decrypt } from "../../helpers/Decrypt";
import url from "url";
import axios from "axios";
import { DISCORD_API_ROUTES } from "../../../types/DiscordAPIRoutes";
import { Request, Response } from "express";
import { axiosConfig } from "../../constants/AxiosConfig";
import SessionsSchema from "../../client/utils/MongoDB/Models/SessionsSchema";
export default async (req: Request, res: Response) => {
  //@ts-ignore
  const decryptedToken = decrypt(req.user?.refreshToken!);
  const formData = new url.URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    client_secret: process.env.DISCORD_CLIENT_SECRET!,
    refresh_token: decryptedToken,
    grant_type: "refresh_token",
  });
  //@ts-ignore
  req.user = undefined;
  await SessionsSchema.deleteMany({ sessionId: req.sessionID });
  res.clearCookie("DISCORD_OAUTH2_SESSION_ID");
  return axios.post(
    DISCORD_API_ROUTES.OAUTH2_TOKEN,
    formData.toString(),
    axiosConfig
  );
};
