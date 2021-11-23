import DiscordClient from "../classes/client";
import BaseYoutubeEvent from "../utils/structures/BaseYoutubeEvent";

type dataType = {
  channel: {
    name: string;
  };
  video: {
    title: string;
    link: string;
  };
};

export default class Notified extends BaseYoutubeEvent {
  constructor() {
    super("video");
  }

  async run(client: DiscordClient, data: dataType) {
    console.log(data);
  }
}
