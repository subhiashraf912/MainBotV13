import RolePlay from "../MongoDB/Models/RolePlaySchema";
import mongoose from "mongoose";
const HandleTimes = async (
  FirstMember: string,
  SecMember: string,
  Server: string,
  Type: string
) => {
  let data = await RolePlay.findOne({ FirstMember, SecMember, Server, Type });
  if (!data) {
    data = await RolePlay.create({
      _id: mongoose.Types.ObjectId(),
      FirstMember,
      SecMember,
      Server,
      times: 0,
      Type,
    });
  }
  let times = data.times;
  times = times + 1;
  data = await RolePlay.findOneAndUpdate(
    { FirstMember, SecMember, Server, Type },
    { times }
  );
  return data.times;
};

export default HandleTimes;
