import { Router } from "express";
import DiscordClient from "../../../client/client";
import {
  AuthenticatedUserContoller,
  RedirectController,
  RefreshTokenController,
  revokeTokenController,
  LoginController,
} from "../../controllers/auth";
export default (client: DiscordClient) => {
  const router = Router();
  router.get("/login", LoginController(client));
  router.get("/discord/redirect", RedirectController(client));
  router.get("/user", AuthenticatedUserContoller(client));
  router.get("/token/revoke", revokeTokenController(client));
  router.get("/token/refresh", RefreshTokenController(client));
  return router;
};
