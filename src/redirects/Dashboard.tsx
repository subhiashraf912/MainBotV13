import { InferGetServerSidePropsType, GetServerSideProps } from "next";
const DashboardRedirect = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  return <></>;
};

export default DashboardRedirect;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    redirect: {
      destination: "/dashboard",
      permanent: false,
    },
  };
};
