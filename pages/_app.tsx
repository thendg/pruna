import { BeaconWallet } from "@taquito/beacon-wallet";
import "../styles/globals.css";
import { WalletContext } from "../components/core/WalletContext";
import type { AppProps } from "next/app";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [wallet, setWallet] = useState<BeaconWallet>(
    null as unknown as BeaconWallet
  );

  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      <Component {...pageProps} />
    </WalletContext.Provider>
  );
}
