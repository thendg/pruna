import ConnectWalletWidget from "./ConnectWalletWidget";
import Page from "./Page";

export default function ConnectWalletPage({ title }: { title: string }) {
  return (
    <Page title={title}>
      <div className="text-black flex justify-center font-inter font-thin w-full h-full items-center">
        <ConnectWalletWidget size="4xl" />
      </div>
    </Page>
  );
}
