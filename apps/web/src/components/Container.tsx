import Head from "next/head";
import { useRouter } from "next/router";

const Container = (props) => {
  const { children, ...customMeta } = props;
  const router = useRouter();
  const meta = {
    title: "SwiftKeys",
    description: "Test out your typing speed!",
    type: "website",
    ...customMeta,
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta name="description" content={meta.description} />
        <meta name="image" content={meta.image} />
      </Head>
      {children}
    </>
  );
};

export default Container;
