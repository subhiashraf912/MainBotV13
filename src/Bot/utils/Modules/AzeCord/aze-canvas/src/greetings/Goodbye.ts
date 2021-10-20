import Greeting from "./Base";
export default class Goodbye extends Greeting {
  constructor() {
    super();
    this.textTitle = "GOODBYE" as any;
    this.textMessage = "Leaving from {server}";
    this.colorTitle = "#df0909";
  }
}
