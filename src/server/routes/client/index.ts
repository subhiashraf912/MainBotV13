import { Router } from "express";
import DiscordClient from "../../client/classes/client";
import clientConfigsController from "../../controllers/client/configs";

export default (client: DiscordClient) => {
  const router = Router();
  router.get("/configs/:id", clientConfigsController(client));
  return router;
};
