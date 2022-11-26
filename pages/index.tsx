import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.17, 0.67, 0.83, 0.67] }}
    >
      <Head>
        <title>Pruna</title>
      </Head>
      <div className="w-full h-screen bg-gray-50 flex flex-col items-center">
        <div className="mt-60 relative">
          <div className="h-1/6 relative mix-blend-multiply filter blur-2xl">
            <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full" />
            <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300 rounded-full" />
            <div className="absolute top-8 left-20 w-96 h-96 bg-pink-300 rounded-full" />
          </div>

          <div className="relative shadow-lg rounded-3xl p-10 flex flex-col items-center justify-center bg-white">
            <div className="text-black">
              <span className="text-9xl font-monoton font-normal">P</span>
              <span className="text-8xl font-inter font-light">RUNA</span>
            </div>

            <span className="w-full h-1 animate-border inline-block bg-white from-pink-500 via-red-500 to-yellow-500 bg-[length:400%_400%] p-0.5 bg-gradient-to-r"></span>

            <h1 className="">PRUNA</h1>
            <div className="space-x-10 text-4xl text-black font-inter font-thin ">
              <Link
                className="hover:underline decoration-1 decoration-gray-300"
                href="/prune"
              >
                Prune
              </Link>
              <Link
                className="hover:underline decoration-1 decoration-gray-300"
                href="/play"
              >
                Play
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
