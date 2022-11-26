import { FormEvent, useContext, useRef } from "react";
import ConnectWalletPage from "../components/core/ConnectWalletPage";
import Page from "../components/core/Page";
import { WalletContext } from "../components/core/WalletContext";

// TODO: if no wallet, fail
const title = "Pruna - Prune";

export default function Prune() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { wallet, setWallet } = useContext(WalletContext);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inputRef.current) {
      inputRef.current.value = "";
      const data = await fetch("/api/hello");
      const json = await data.json();
    }
  }

  return wallet ? (
    <Page title={title} logo>
      <div className="pt-10 flex flex-col items-center space-y-28">
        <span className="text-black text-8xl font-inter font-light">Prune</span>

        <form className="relative" onSubmit={onSubmit}>
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
      </div>
    </Page>
  ) : (
    <ConnectWalletPage title={title} />
  );
}
