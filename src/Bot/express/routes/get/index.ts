import DiscordClient from "../../../client/client";
import { Express, Request, Response } from "express";
import BaseGet from "../../classes/bases/BaseGet";
import { join } from "path";
import express from "express";
const GetGuilds = async (app: Express, client: DiscordClient) => {
	const route = "";
	const callBack = (Request: Request, Response: Response) => {
		const distPath = join(process.cwd(), "/dashboard");
		app.use(express.static(distPath));
		app.use(route, (req, res) => {
			res.status(200).sendFile(`${distPath}/index.html`);
		});

		return {};
	};
	return new BaseGet({ app, route, callBack });
};

export default GetGuilds;
