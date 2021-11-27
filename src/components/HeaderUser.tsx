import { ClientUser } from "discord.js";
import UserResponse from "../types/UserResponse";
import UserObject from "./UserObject";
const HeaderUser = (props: { userData: UserResponse, botData:ClientUser }) => {
    const { userData, botData } = props;
    return userData ? (
        <UserObject avatarLink={`https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png?size=4096`} username={userData.username} />
    ) : (
        <UserObject avatarLink={`https://cdn.discordapp.com/avatars/${botData.id}/${botData.avatar}.png?size=4096`} username={botData.username} />
    )
};

export default HeaderUser;
