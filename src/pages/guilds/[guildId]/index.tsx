import { InferGetServerSidePropsType } from "next";
import { GetServerSideProps } from "next";
import config from "../../../config.json";
import configType from '../../../types/GuildConfig';
const guildsPage = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  
  return (
    <div className="center-box" style={{ width: "50%" }}>
      <p>
        Welcome Message: { data.welcomeMessage}
      </p>
      <p>
        prefix: { data.prefix }
      </p>
    </div>
  );
};

export default guildsPage;


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, res } = ctx;
  const { cookies } = req;
  const DiscordCookie = cookies.DISCORD_OAUTH2_SESSION_ID;
  try {
    console.log(ctx.params?.guildId)
    const response = await fetch(`${config.dashboard}/api/client/configs/${ctx.params?.guildId}`, {
      headers: {
        Cookie: `DISCORD_OAUTH2_SESSION_ID=${DiscordCookie}`,
      },
    });
    const data: configType = await response.json();
    return {
      props: {
        data,
      },
    };
  } catch {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
