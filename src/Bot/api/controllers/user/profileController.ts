import { Request, Response } from "express";
import fetchDiscordUserService from "../../services/user/fetchDiscordUser.service";
import STATUS_CODES from "../../types/StatusCodes";
export async function getDiscordUser(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(STATUS_CODES.UNAUTHORIZED);
  try {
    const { accessToken } = req.user;
    const { data: user } = await fetchDiscordUserService(accessToken);
    res.send(user);
  } catch (err) {
      res.sendStatus(STATUS_CODES.BAD_REQUEST);
      
  }
}
