import { ClientUser } from "discord.js";
import Link from "next/link";
import navLinks from "../utils/navLinks";
const NavigationBar = (props: { botData: ClientUser }) => {
  const { botData } = props;
  return (
    <div>
       <nav>
            <ul>
        {navLinks.map((link, index) => {
          return (
              <Link passHref={true} key={index} href={link.path.replace("{botId}", botData.id).replace("{BotName}", botData.username)}>
                <li>
                  {link.name.replace("{botId}", botData.id).replace("{BotName}", botData.username)}
                  </li>
              </Link>
          );
        })}
            </ul>
      </nav>
    </div>
  );
};

export default NavigationBar;
