import { Express, Request, Response } from "express";
export default class BaseGet {
	constructor(private options: BaseGetOptions) {
		const route = this.options.route;
		const app = this.options.app;
		const callBackFunction = this.options.callBack;
		app.get(route, callBackFunction);
	}
}

interface BaseGetOptions {
	route: string;
	app: Express;
	callBack: (Request: Request, Response: Response) => {};
}
