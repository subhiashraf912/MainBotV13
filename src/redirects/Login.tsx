import { InferGetServerSidePropsType, GetServerSideProps } from "next";
const Login = ({}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <></>;
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    redirect: {
      destination: "/api/auth/login",
      permanent: false,
    },
  };
};
