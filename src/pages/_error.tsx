import { NextPageContext } from "next";

const Error = (data: any) => {
  return (
    <p>
      {data.statusCode
        ? `An error ${data.statusCode} occurred on server`
        : "An error occurred on client"}
    </p>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
