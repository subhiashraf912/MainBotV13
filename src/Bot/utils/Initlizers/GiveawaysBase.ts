import { GiveawayData, GiveawaysManager } from "discord-giveaways";
import giveawayModel from "../MongoDB/Models/GiveawaysSchema";
export default class extends GiveawaysManager {
  // This function is called when the manager needs to get all giveaways which are stored in the database.
  async getAllGiveaways() {
    // Get all giveaways from the database. We fetch all documents by passing an empty condition.
    return await giveawayModel.find({});
  }

  // This function is called when a giveaway needs to be saved in the database.
  async saveGiveaway(messageID: string, giveawayData: GiveawayData) {
    // Add the new giveaway to the database
    await giveawayModel.create(giveawayData);
    // Don't forget to return something!
    return true;
  }

  // This function is called when a giveaway needs to be edited in the database.
  async editGiveaway(messageID: string, giveawayData: any) {
    // Find by messageID and update it
    await giveawayModel
      .findOneAndUpdate({ messageID: messageID }, giveawayData)
      .exec();
    // Don't forget to return something!
    return true;
  }

  // This function is called when a giveaway needs to be deleted from the database.
  async deleteGiveaway(messageID: string): Promise<void> {
    // Find by messageID and delete it
    const giveawayDeletedData = await giveawayModel
      .findOneAndDelete({ messageID: messageID })
      .exec();
    // Don't forget to return something!
    return;
  }
}
