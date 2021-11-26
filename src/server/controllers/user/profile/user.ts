import { Request, Response } from "express";
import fetchDiscordUserService from "../../../services/user/fetchDiscordUser.service";
import STATUS_CODES from "../../../../types/StatusCodes";
export async function getUser(req: Request, res: Response) {
  //@ts-ignore
  if (!req.user) return res.sendStatus(STATUS_CODES.UNAUTHORIZED);
  try {
    //@ts-ignore
    const { accessToken } = req.user;
    //@ts-ignore
    const { data: user } = await fetchDiscordUserService(accessToken);
    res.send(user);
  } catch (err) {
    res.sendStatus(STATUS_CODES.BAD_REQUEST);
  }
}
