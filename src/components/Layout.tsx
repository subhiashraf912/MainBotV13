import { ClientUser } from "discord.js"
import { FC } from "react"
import UserResponse from "../types/UserResponse";
import Footer from "./Footer";
import Header from "./Header"
interface props {
    botData: ClientUser;
    userData: UserResponse
}

const Layout:FC<props> = (props) => {
    return (
        <>
            <Header userData={props.userData} botData={props.botData} />
            { props.children }
            <Footer/>
        </>
    )
}

export default Layout