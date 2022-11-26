import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col items-center">
      <div className="mt-60 relative bg-slate-900">
        <div className="shadow-lg rounded-3xl p-10 flex flex-col items-center justify-center bg-white">
          <h1 className="text-9xl text-black font-inter font-light">PRUNA</h1>
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

        <div className="absolute w-72 h-72 bg-purple-300 rounded-full" />
      </div>
    </div>
  );
}
