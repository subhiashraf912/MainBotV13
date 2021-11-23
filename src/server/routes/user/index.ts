import { Router } from "express";
import DiscordClient from "../../client/classes/client";
import guildsController from "../../controllers/user/guildsController";
import {
  getUser,
  getUserAccentColor,
  getUserAvatar,
  getUserAvatarURL,
  getUserBanner,
  getUserBannerColor,
  getUserBannerURL,
  getUserDiscriminator,
  getUserEmail,
  getUserId,
  getUserLocale,
  getUserMFA,
  getUserPublicFlags,
  getUserTag,
  getUserUsername,
  getUserVerified,
} from "../../controllers/user/profile";
export default (client: DiscordClient) => {
  const router = Router();
  router.get("/profile", getUser);
  router.get("/guilds", guildsController(client));
  return router;
};
