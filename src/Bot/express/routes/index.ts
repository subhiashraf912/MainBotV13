import { Router } from "express";
import DiscordClient from "../../client/client";
import authRoutes from "./auth";
export default (client: DiscordClient) => {
  const router = Router();
  router.use("/auth", authRoutes(client));

  return router;
}
