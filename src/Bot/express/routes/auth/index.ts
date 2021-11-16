import { Router } from "express";
import DiscordClient from "../../../client/client";
import {
  authDiscordRedirectController,
  authDiscordRefreshTokenController,
  authDiscordRevokeTokenController,
  authDiscordUserController,
  authDiscordUserGuildsController,
  getAuthenticatedUserController,
} from "../../controllers/auth";
export default (client: DiscordClient) => {
  const router = Router();
  router.get("/discord/redirect", authDiscordRedirectController(client));
  // router.get('/user',authDiscordUserController(client));
  router.get("/user", getAuthenticatedUserController);
  router.get("/token/revoke", authDiscordRevokeTokenController(client));
  router.get("/token/refresh", authDiscordRefreshTokenController(client));
  router.get("/user/guilds", authDiscordUserGuildsController(client));
  return router;
}
