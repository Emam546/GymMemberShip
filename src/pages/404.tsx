import Page404 from "@src/components/pages/404";
import Head from "next/head";

function Page() {
  return (
    <>
      <Head>404</Head>
      <Page404 message="The Page url is not exist" />;
    </>
  );
}

export default Page;
