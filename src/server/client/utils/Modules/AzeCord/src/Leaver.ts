import { Base } from "../aze-canvas";
import Util from "./Util";

class Leaver extends Base {
  constructor() {
    super();

    this.textTitle = "GOODBYE" as any;
    this.textMessage = "We will miss you!";
    this.colorTitle = "#03A9F4";
    this.__updateData();
  }

  __updateData(): void {
    this.setUsername("Discord User");
    this.setDiscriminator("0000");
    this.setMemberCount(100);
    this.setGuildName("Discord Server");
    this.setAvatar(`https://cdn.discordapp.com/embed/avatars/0.png`);
    this.setColor("border", "#ff4a4a");
    this.setColor("username-box", "#ff4a4a");
    this.setColor("discriminator-box", "#ff4a4a");
    this.setColor("message-box", "#ff4a4a");
    this.setColor("title", "#ff4a4a");
    this.setColor("avatar", "#ff4a4a");
  }

  setColor(
    id:
      | "title"
      | "title-border"
      | "avatar"
      | "username"
      | "username-box"
      | "hashtag"
      | "discriminator"
      | "discriminator-box"
      | "message"
      | "message-box"
      | "member-count"
      | "background"
      | "border",
    color: string
  ) {
    super.setColor(id, color);
    return this;
  }
  setMemberCount(memberCount: number | string = 100) {
    super.setMemberCount(Util.toAbbrev(memberCount));
    return this;
  }
  async build(): Promise<Buffer> {
    return (await this.toAttachment()).toBuffer();
  }
}

export default Leaver;
