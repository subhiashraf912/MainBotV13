import { Router } from "express";
import DiscordClient from "../../client/classes/client";
import clientConfigsController from "../../controllers/client/configs";
import getClientUser from "../../controllers/client/user";

export default (client: DiscordClient) => {
  const router = Router();
  router.get("/configs/:id", clientConfigsController(client));
  router.get("/user", getClientUser(client));
  return router;
};