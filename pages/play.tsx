import { useContext, useState } from "react";
import ConnectWalletPage from "../components/core/ConnectWalletPage";
import Page from "../components/core/Page";
import { WalletContext } from "../components/core/WalletContext";
import { PrismaClient } from "@prisma/client";
import { Batch } from "@prisma/client";

const prisma = new PrismaClient();
const title = "Pruna - Play";

export async function getServerSideProps() {
  const batches = await prisma.batch.findMany();
  return {
    props: { initialBatchData: batches },
  };
}

function BatchView({ origin }: { origin: string }) {
  const shortOrigin =
    origin.substring(0, 4) +
    " ... " +
    origin.substring(origin.length - 4, origin.length);

  return (
    <div className="p-6 bg-white w-60 flex flex-col items-center border border-gray-200 rounded-lg shadow-md ">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-black font-source-code-pro">
        {shortOrigin}
      </h5>
      <p className="mb-3 font-normal text-gray-400">
        Show pruning progress here // TODO
      </p>
      <a
        href={`/play/${origin}`}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-black rounded-lg hover:bg-stone-900 focus:ring-4 focus:outline-none "
      >
        Play
        <svg
          aria-hidden="true"
          className="w-4 h-4 ml-2 -mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </a>
    </div>
  );
}

export default function Play({
  initialBatchData,
}: {
  initialBatchData: Batch[];
}) {
  const [batchData, setBatchData] = useState(initialBatchData);
  const { wallet } = useContext(WalletContext);

  const batches: JSX.Element[] = [];
  for (const data of batchData)
    batches.push(
      <li key={data.origin}>
        <BatchView origin={data.origin} />
      </li>
    );

  return wallet ? (
    <Page title={title} logo>
      <div className="pt-32 px-10 grid">
        <ul className="text-black">{batches}</ul>
      </div>
    </Page>
  ) : (
    <ConnectWalletPage title={title} />
  );
}
