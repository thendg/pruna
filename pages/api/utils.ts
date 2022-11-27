import { Web3Storage } from "web3.storage";

export function getStorageClient() {
    return new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN! });
  }
  
  async function getIPFSFile(cid: string) {
    const res = await fetch(
      `https://api.ipfsbrowser.com/ipfs/get.php?hash=${cid}`
    );
    return await res.json();
  }
  
  export  async function listIPFSDirectory(cid: string) {
    const client = getStorageClient();
    const web3Res = await client.get(cid as string);
    if (web3Res) {
      if (!web3Res.ok)
        throw Error(
          `failed to get ${cid} - [${web3Res.status}] ${web3Res.statusText}`
        );
  
      return await web3Res.files();
    } else throw Error("Failed to get response from Web3.Storage");
  }
  
  export  async function getIPFSFromDirectory(directoryCID: string, filename: string) {
    const files = await listIPFSDirectory(directoryCID as string);
  
    const file = files.find((file) => file.name == filename);
    if (!file) throw Error(`Failed to find ${directoryCID}/${filename}`);
    return file;
  }