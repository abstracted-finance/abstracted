import Head from "next/head";
import Main from "../components/main/Main";

const Home = (props) => {
  return (
    <>
      <Head>
        <title>Abstracted</title>
        <meta name="description" content="Decentralized finance, abstracted" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Main {...props} />
    </>
  );
};

export default Home;
