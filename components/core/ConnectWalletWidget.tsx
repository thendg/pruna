import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType } from "@airgap/beacon-types";
import { useContext } from "react";
import { WalletContext } from "./WalletContext";

const NETWORK_TYPE = NetworkType.GHOSTNET;

export default function ConnectWalletWidget({
  size = "xl",
}: {
  size?: string;
}) {
  const { setWallet } = useContext(WalletContext);

  async function connect() {
    const options = {
      name: "Pruna",
      iconUrl: "./logo.png",
      preferredNetwork: NETWORK_TYPE,
    };
    const wallet = new BeaconWallet(options);

    await wallet.requestPermissions({
      network: {
        type: NETWORK_TYPE,
      },
    });

    setWallet!(wallet);
  }

  return (
    <span
      className={`animate-bounce text-${size} hover:border-b-2 shadow-lg rounded-full p-2 text-black font-inter font-light cursor-pointer`}
      onClick={connect}
    >
      Connect Wallet
    </span>
  );
}
