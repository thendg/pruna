import { FormEvent, useContext, useRef, useState } from "react";
import ConnectWalletPage from "../components/core/ConnectWalletPage";
import Page from "../components/core/Page";
import { WalletContext } from "../components/core/WalletContext";
import { BatchFile } from "./api/batch/[cid]";
import type { BatchJSONResponse } from "./api/batch/[cid]";
import { TezosToolkit } from "@taquito/taquito";
import { RPC_URL, CONTRACT_ADDRESS } from "../env";

const title = "Pruna - Prune";

function File({ file }: { file: BatchFile }) {
  const { path, CID } = file;

  return (
    <div className="flex items-center">
      <div>
        <p className="text-sm font-medium truncate text-black">{path}</p>
        <p className="text-sm text-gray-500 truncate">{CID}</p>
      </div>
    </div>
  );
}

export default function Prune() {
  const cidRef = useRef<HTMLInputElement>(null);
  const rewardRef = useRef<HTMLInputElement>(null);
  const { wallet } = useContext(WalletContext);
  const [files, setFiles] = useState<JSX.Element[]>([]);
  const Tezos = new TezosToolkit(RPC_URL);
  if (wallet) Tezos.setWalletProvider(wallet);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cidRef.current) return;

    const data = await fetch(`/api/batch/${cidRef.current.value}`, {
      method: "GET",
    });
    const json: BatchJSONResponse = await data.json();

    const files = [];
    for (const file of json.batch)
      files.push(
        <li className="py-3" key={file.CID}>
          <File file={file} />
        </li>
      );

    setFiles(files);
  }

  async function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cidRef.current) return;
    if (!rewardRef.current) return;
    if (!parseInt(rewardRef.current.value)) return;

    const op = await Tezos.contract.transfer({
      to: CONTRACT_ADDRESS,
      amount: parseInt(rewardRef.current.value),
    });
    try {
      await op.confirmation(1);
      console.log(`Operation Injected: https://ghost.tzstats.com/${op.hash}`);
    } catch (error) {
      console.log(error);
      return;
    }

    const contract = await Tezos.contract.at(CONTRACT_ADDRESS);
    contract.methods.Add_batch(cidRef.current.value, rewardRef.current.value);

    const data = await fetch(`/api/batch/${cidRef.current.value}`, {
      method: "POST",
    });
    const message =
      data.status == 200 ? "Success" : "Failed: " + data.statusText;

    console.log(message);
    alert(message);

    cidRef.current.value = "";
    rewardRef.current.value = "";
  }

  return wallet ? (
    <Page title={title} logo>
      <div className="pt-10 flex flex-col items-center justify-center space-y-5">
        <span className="text-black text-8xl font-inter font-light">Prune</span>

        <div className="flex space-y-2 relative w-full items-center flex-col">
          <form className="relative w-1/3" onSubmit={submit}>
            <input
              ref={cidRef}
              className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none"
              placeholder="IPFS CID"
              required
            />

            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Prune
            </button>
          </form>

          {files.length && (
            <form className="relative w-1/3" onSubmit={confirm}>
              <input
                ref={cidRef}
                className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none"
                placeholder="Batch Reward"
                required
              />

              <button
                type="submit"
                className="text-white absolute right-2.5 bottom-2.5 bg-gradient-to-br bg-black font-medium rounded-lg text-sm px-4 py-2 text-center from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 animate-pulse"
              >
                Confirm
              </button>
            </form>
          )}
        </div>

        <div className="w-full flex justify-center">
          <div className="p-4 bg-white rounded-lg border shadow-md w-2/5 space-y-2">
            <h3 className="text-xl font-bold text-black">
              {files.length > 0 ? "Listed Files" : "No files"}
            </h3>

            <ul className="divide-y divide-gray-200">{files}</ul>
          </div>
        </div>
      </div>
    </Page>
  ) : (
    <ConnectWalletPage title={title} />
  );
}
