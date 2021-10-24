import DiscordClient from "../../../client/client";
import { Express, Request, Response } from "express";
import BaseGet from "../../classes/bases/BaseGet";
const GetUsers = (app: Express, client: DiscordClient) => {
	const route = "/users";
	const callBack = (Request: Request, Response: Response) => {
		Response.send(client.users.cache);
		return {};
	};
	return new BaseGet({ app, route, callBack });
};

export default GetUsers;
