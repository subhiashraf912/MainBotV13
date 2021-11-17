import { decrypt } from "../../helpers/Decrypt";
import url from "url";
import axios from "axios";
import { DISCORD_API_ROUTES } from "../../types/DiscordAPIRoutes";
import { Request } from "express";
import { axiosConfig } from "../../constants/AxiosConfig";
import SessionsSchema from "../../../utils/MongoDB/Models/SessionsSchema";
export default async (req: Request) => {
  const decryptedToken = decrypt(req.user?.accessToken!);
  const formData = new url.URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    client_secret: process.env.DISCORD_CLIENT_SECRET!,
    token: decryptedToken,
  });
  req.user = undefined;
  await SessionsSchema.deleteMany({ sessionId: req.sessionID });
  req.session.destroy((err) => {});
  return axios.post(
    DISCORD_API_ROUTES.OAUTH2_TOKEN_REVOKE,
    formData.toString(),
    axiosConfig
  );
};
