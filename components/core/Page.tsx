import Head from "next/head";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Page({
  children,
  title,
  logo = false,
}: {
  children: JSX.Element;
  title: string;
  logo?: boolean;
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.17, 0.67, 0.83, 0.67] }}
        className="w-full h-screen bg-gray-50"
      >
        {logo && (
          <Link className="absolute pt-5 pl-5 w-20" href="/">
            <img src="./logo.png" alt="Pruna logo"></img>
          </Link>
        )}
        {children}
      </motion.div>
    </>
  );
}
