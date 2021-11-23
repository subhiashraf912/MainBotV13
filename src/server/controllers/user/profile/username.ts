import { Request, Response } from "express";
import fetchDiscordUserService from "../../../services/user/fetchDiscordUser.service";
import STATUS_CODES from "../../../../types/StatusCodes";
export async function getUserUsername(req: Request, res: Response) {
  //@ts-ignore
  if (!req.user) return res.sendStatus(STATUS_CODES.UNAUTHORIZED);
  try {
    //@ts-ignore
    const { accessToken } = req.user;
    const { data: user } = await fetchDiscordUserService(accessToken);
    res.send(user.username);
  } catch (err) {
    res.sendStatus(STATUS_CODES.BAD_REQUEST);
  }
}
