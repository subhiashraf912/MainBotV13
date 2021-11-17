import { Request, Response } from "express";
import DiscordClient from "../../../client/client";
import STATUS_CODES from "../../types/StatusCodes";
export default (client: DiscordClient) => {
  return function loginController(req: Request, res: Response) {
    if (req.user) return res.send(STATUS_CODES.OK);
    const clientId = process.env.DISCORD_CLIENT_ID;
    const host = req.get('host')!;
    const protocol = host.includes('localhost') ? "http" : "https";
    const link = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${protocol}%3A%2F%2F${req.get(
      "host"
    )}%2Fapi%2Fauth%2Fdiscord%2Fredirect&response_type=code&scope=identify%20email%20guilds%20guilds.join`;
    res.redirect(link);
  };
};
