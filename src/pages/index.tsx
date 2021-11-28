import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import UserResponse from "../types/UserResponse";
import config from "../config.json";
import { ClientUser } from "discord.js";
import { NextSeo } from "next-seo";
import Landing from "../components/Landing";
const Home: NextPage = ({
  data: APIData,
  clientUserData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const clientUser: ClientUser = clientUserData;
  const data: UserResponse = APIData;
  return (
    <>
      <NextSeo
        title={`${clientUser.username} Dashboard`}
        description="The all in one bot. Everything you need in 1 bot!"
      />
      <Landing botData={clientUser} userData={data} />
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, res } = ctx;
  const { cookies } = req;
  const clientUserResponse = await fetch(`${config.dashboard}/api/client/user`);
  const clientUserData: ClientUser = await clientUserResponse.json();

  try {
    const DiscordCookie = cookies.DISCORD_OAUTH2_SESSION_ID;
    const response = await fetch(`${config.dashboard}/api/user/profile`, {
      headers: {
        Cookie: `DISCORD_OAUTH2_SESSION_ID=${DiscordCookie}`,
      },
    });

    const data: UserResponse = await response.json();
    return {
      props: {
        data,
        clientUserData,
      },
    };
  } catch (err) {
    return {
      props: {
        data: null,
        clientUserData,
      },
    };
  }
};
