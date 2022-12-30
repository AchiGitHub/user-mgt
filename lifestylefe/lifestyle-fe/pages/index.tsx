import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  const token = context.req.cookies?.token;
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/membership",
      },
    };
  }
};

export default function Home() {
  return <div></div>;
}
