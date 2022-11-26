import Link from "next/link";
import Page from "../components/core/Page";
import { useContext } from "react";
import { WalletContext } from "../components/core/WalletContext";
import ConnectWalletWidget from "../components/core/ConnectWalletWidget";

export default function Home() {
  const { wallet } = useContext(WalletContext);

  return (
    <Page title="Pruna">
      <div className="flex flex-col items-center">
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

            <div className="mt-8 space-x-10 text-4xl text-black font-inter font-thin ">
              {wallet ? (
                <>
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
                </>
              ) : (
                <ConnectWalletWidget />
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
