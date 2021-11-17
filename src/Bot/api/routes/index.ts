import { Router } from "express";
import DiscordClient from "../../client/client";
import authRoutes from "./auth";
import userRoutes from "./user";
export default (client: DiscordClient) => {
  const router = Router();
  router.use("/auth", authRoutes(client));
  router.use("/user", userRoutes(client));
  return router;
};
