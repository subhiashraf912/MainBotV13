import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Link from "next/link";
import UserResponse from "../types/UserResponse";
import config from "../config.json";
import Button from '@mui/material/Button';
import { ClientUser } from "discord.js";

const Home: NextPage = ({
  data:APIData, clientUserData
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const clientUser: ClientUser = clientUserData;
  const data:UserResponse = APIData;
  return (
    <>
      <title>{ clientUser.username } Dashboard</title>
      <div className="center-box" style={{ width: "50%" }}>
        <h1>{clientUser.username}</h1>
        {!data ? (
          <a href={`${config.dashboard}/api/auth/login`}>Login</a>
        ) : (
          <>
            <h4>{data.username}</h4>
              <Link href="/guilds">
                <>
                  <Button variant='contained'>Go to servers</Button>
                  </>
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, res } = ctx;
  const { cookies } = req;
  try {
    const DiscordCookie = cookies.DISCORD_OAUTH2_SESSION_ID;
    const response = await fetch(`${config.dashboard}/api/user/profile`, {
      headers: {
        Cookie: `DISCORD_OAUTH2_SESSION_ID=${DiscordCookie}`,
      },
    });
    const clientUserResponse = await fetch(`${config.dashboard}/api/client/user`, {
      headers: {
        Cookie: `DISCORD_OAUTH2_SESSION_ID=${DiscordCookie}`,
      },
    });
    const data: UserResponse = await response.json();
    const clientUserData: ClientUser = await clientUserResponse.json();
    return {
      props: {
        data, clientUserData
      },
    };
  } catch (err) {
    return {
      props: {
        data: null,
      },
    };
  }
};
