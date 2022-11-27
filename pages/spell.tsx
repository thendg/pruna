import { FormEvent, useContext, useRef, useState } from "react";
import Page from "../components/core/Page";
import inventory from "./prune";

const title = "Pruna - Spell";


const goBack = () => {
    <a href="/game"></a>
};

export default function Spell() {
  return (
    <Page title={title} logo>
      <div className="pt-10 flex flex-col items-center justify-center space-y-5">
        <span className="text-black text-8xl font-inter font-light">Spell your Word</span>

        <div className="flex space-y-2 relative w-full items-center flex-col">
          <form className="relative w-1/3" onSubmit={goBack()}>
            <input
              className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none"
              required
            />

            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </form>
          
          <div className="text-black text-3xl flex flex-col items-center font-source-code-pro space-y-4">
          <p>LETTERS: [{inventory.toString()}]</p>
        </div>

        </div>
        </div>
    </Page>
  );
}
