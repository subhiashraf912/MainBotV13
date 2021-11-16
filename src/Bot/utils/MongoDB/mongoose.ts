import mongoose from "mongoose";
const init = async (mongoURI: string): Promise<void> => {
  mongoose.set("overwriteModels", false);
  mongoose.Promise = global.Promise;

  mongoose.connection.on("connected", () => {
    console.log("Mongoose has successfully connected!");
  });

  mongoose.connection.on("err", (err: any) => {
    console.error(`Mongoose connection error: \n${err.stack}`);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("Mongoose connection lost");
  });

  await mongoose.connect(mongoURI as string, {
    autoIndex: false,

    maxPoolSize: 5,
    connectTimeoutMS: 10000,
    family: 4,
  });
}
export default init;
