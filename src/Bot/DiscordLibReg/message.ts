import { Message } from "discord.js";
export default () => {
  Reflect.defineProperty(Message.prototype, "rik", {
    get() {
      return "Rik is hentai";
    },
  });
};
