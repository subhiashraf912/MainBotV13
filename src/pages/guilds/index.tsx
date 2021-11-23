import { InferGetServerSidePropsType } from "next";
import GuildBox from "../../components/GuildBox";
import { GetServerSideProps } from "next";
import config from "../../config.json";
const guildsPage = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="center-box" style={{ width: "50%" }}>
      {(data as Guild[]).map((guild) => {
        return (
          <GuildBox
            key={guild.id}
            guildId={guild.id}
            guildName={guild.name}
            guildIcon={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=4096`}
          />
        );
      })}
    </div>
  );
};

export default guildsPage;

interface Guild {
  name: string;
  id: string;
  icon: string;
  ownerId: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, res } = ctx;
  const { cookies } = req;
  const DiscordCookie = cookies.DISCORD_OAUTH2_SESSION_ID;
  const response = await fetch(`${config.dashboard}/api/user/guilds`, {
    headers: {
      Cookie: `DISCORD_OAUTH2_SESSION_ID=${DiscordCookie}`,
    },
  });
  const data: Guild[] = await response.json();
  return {
    props: {
      data,
    },
  };
};
