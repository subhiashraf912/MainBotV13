import { Router } from "express";
import DiscordClient from "../client/classes/client";
import authRoutes from "./auth";
import userRoutes from "./user";
import clientRoutes from "./client";
export default (client: DiscordClient) => {
  const router = Router();
  router.use("/auth", authRoutes(client));
  router.use("/user", userRoutes(client));
  router.use("/client", clientRoutes(client));
  return router;
};
