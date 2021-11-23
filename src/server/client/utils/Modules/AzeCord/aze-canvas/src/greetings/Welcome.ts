import Greeting from "./Base";

export default class Welcome extends Greeting {
  constructor() {
    super();
    this.textTitle = "WELCOME" as any;
    this.textMessage = "Welcome in {server}";
    this.colorTitle = "#03A9F4";
  }
}
