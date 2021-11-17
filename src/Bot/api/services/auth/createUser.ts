import DashboardUsers from "../../../utils/MongoDB/Models/DashboardUsers";
import CreateUserParams from "../../types/CreateUserParams";

async function createUser(params: CreateUserParams) {
  let newUser = await DashboardUsers.findOneAndUpdate(
    {
      discordId: params.discordId,
    },
    {
      guilds: params.guilds,
      refreshToken: params.refreshToken,
      accessToken: params.accessToken,
    },
    { new: true }
  );
  if (!newUser) {
    newUser = await DashboardUsers.create({
      discordId: params.discordId,
      guilds: params.guilds,
      refreshToken: params.refreshToken,
      accessToken: params.accessToken,
    });
  }
  return newUser;
}
export default createUser;
