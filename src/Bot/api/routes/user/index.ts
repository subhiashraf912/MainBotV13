import { Router } from "express";
import DiscordClient from "../../../client/client";
import guildsController from "../../controllers/user/guildsController";
import { getDiscordUser as profile } from "../../controllers/user/profileController";
export default (client: DiscordClient) => {
  const router = Router();
  router.get("/profile", profile);
  router.get("/guilds", guildsController(client));
  return router;
};
