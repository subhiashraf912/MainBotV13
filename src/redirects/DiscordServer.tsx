import { InferGetServerSidePropsType, GetServerSideProps } from "next";
const DiscordServerRedirect = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  return <></>;
};

export default DiscordServerRedirect;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    redirect: {
      destination: "https://discord.gg/nQ55ZUSavA",
      permanent: false,
    },
  };
};
