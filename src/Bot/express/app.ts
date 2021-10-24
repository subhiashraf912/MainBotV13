import express from "express";
import DiscordClient from "../client/client";
import { registerGetRoutes } from "../utils/registry";

const initExpress = (client: DiscordClient) => {
	const app = express();
	registerGetRoutes(client, "../express/routes/get");
	app.listen(3001, "localhost", () => {
		console.log("listening on port 3001");
	});
	return app;
};
export default initExpress;
