import express from "express";
import DiscordClient from "../client/client";
import { registerGetRoutes } from "../utils/registry";

const initExpress = (client: DiscordClient) => {
	const app = express();
	registerGetRoutes(client, "../express/routes/get");
	const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
	app.listen(port, "localhost", () => {
		console.log("listening on port 3001");
	});
	return app;
};
export default initExpress;
