import { BeaconWallet } from "@taquito/beacon-wallet";
import { createContext, Dispatch, SetStateAction } from "react";

export const WalletContext = createContext<{
  wallet: BeaconWallet | null;
  setWallet: Dispatch<SetStateAction<BeaconWallet>> | null;
}>({ wallet: null, setWallet: null });
