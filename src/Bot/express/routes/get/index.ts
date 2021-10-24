import DiscordClient from "../../../client/client";
import { Express, Request, Response } from "express";
import BaseGet from "../../classes/bases/BaseGet";
const GetGuilds = async (app: Express, client: DiscordClient) => {
	const route = "/";
	const callBack = (Request: Request, Response: Response) => {
		Response.sendFile("dashboard/index.html");
		return {};
	};
	return new BaseGet({ app, route, callBack });
};

export default GetGuilds;
