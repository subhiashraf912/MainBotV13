import { GiveawayData, GiveawaysManager } from "discord-giveaways";
import giveawayModel from "../MongoDB/Models/GiveawaysSchema";
export default class extends GiveawaysManager {
  async getAllGiveaways() {
    return await giveawayModel.find({});
  }

  async saveGiveaway(messageID: string, giveawayData: GiveawayData) {
    await giveawayModel.create(giveawayData);
    return true;
  }

  async editGiveaway(messageID: string, giveawayData: any) {
    await giveawayModel
      .findOneAndUpdate({ messageID: messageID }, giveawayData)
      .exec();
    return true;
  }

  async deleteGiveaway(messageID: string): Promise<boolean> {
    try {
      const giveawayDeletedData = await giveawayModel
        .findOneAndDelete({ messageID: messageID })
        .exec();
      return true;
    } catch {
      return false;
    }
  }
}
