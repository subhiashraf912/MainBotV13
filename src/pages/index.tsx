import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Link from "next/link";
import UserResponse from "../types/UserResponse";
import config from "../config.json";
const Home: NextPage = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <div className="center-box" style={{ width: "50%" }}>
        <h1>BotName</h1>
        {!data ? (
          <a href={`${config.dashboard}/api/auth/login`}>Login</a>
        ) : (
          <>
            <h4>{data.username}</h4>
            <Link href="/guilds">Go to servers</Link>
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
    const data: UserResponse = await response.json();
    return {
      props: {
        data,
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
