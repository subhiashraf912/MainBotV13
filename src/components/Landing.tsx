import { ClientUser } from "discord.js";
import UserResponse from "../types/UserResponse";
import Header from "./Header";
type props = {
  userData: UserResponse;
  botData: ClientUser;
};

const Landing = (props: props) => {
  const { userData, botData } = props;
  return (
    <>
    </>
  );
};

export default Landing;
