import { FormEvent, useContext, useRef, useState } from "react";
import ConnectWalletPage from "../components/core/ConnectWalletPage";
import Page from "../components/core/Page";
import { WalletContext } from "../components/core/WalletContext";
import { BatchFile } from "./api/batch";
import type { BatchJSONResponse } from "./api/batch";

const title = "Pruna - Prune";

function File({ file }: { file: BatchFile }) {
  const { path, CID } = file;

  return (
    <li className="py-3">
      <div className="flex items-center">
        <div>
          <p className="text-sm font-medium truncate text-black">{path}</p>
          <p className="text-sm text-gray-500 truncate">{CID}</p>
        </div>
      </div>
    </li>
  );
}

export default function Prune() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { wallet } = useContext(WalletContext);
  const [files, setFiles] = useState<JSX.Element[]>([]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inputRef.current) {
      inputRef.current.value = "";
      const data = await fetch("/api/batch");
      const json: BatchJSONResponse = await data.json();

      const files = [];
      for (const file of json.batch) files.push(<File file={file} />);

      setFiles(files);
    }
  }

  async function confirm() {
    if (inputRef.current) {
      const data = await fetch("/api/add-batch"); // TODO batch fees?
      const message =
        data.status == 200 ? "Success" : "Failed: " + data.statusText;
      console.log(message);
      alert(message);
    }
  }

  return wallet ? (
    <Page title={title} logo>
      <div className="pt-10 flex flex-col items-center justify-center space-y-5">
        <span className="text-black text-8xl font-inter font-light">Prune</span>

        <div className="flex items-center space-x-2 relative">
          <form className="relative" onSubmit={submit}>
            <input
              ref={inputRef}
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

          {files.length > 0 && (
            <button
              type="button"
              className="animate-pulse absolute top-2 -right-20 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-3 py-2 text-center mr-2 mb-2"
              onClick={confirm}
            >
              Confirm
            </button>
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
