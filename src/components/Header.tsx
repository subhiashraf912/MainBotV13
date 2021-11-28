import UserResponse from "../types/UserResponse";
import { ClientUser } from "discord.js";
import NavigationBar from "./NavigationBar";
type props = {
  userData: UserResponse;
  botData: ClientUser;
};
const Header = (props: props) => {
  const { userData, botData } = props;
  return (
    <>
      <NavigationBar userData={userData} botData={botData} />
    </>
  );
};

export default Header;
