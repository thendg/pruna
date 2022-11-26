/* receives a address of a reference file in IPFS, return a json in the format:
{
    "batch": [
        "file1",
        "file2",
        "folder/file3"
    ]
}
*/

import { Web3Storage } from "web3.storage";
import type { NextApiRequest, NextApiResponse } from "next";

export type BatchFile = {
  path: string;
  CID: string;
};

export type BatchJSONResponse = {
  batch: BatchFile[];
};

function getStorageClient() {
  return new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN! });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BatchJSONResponse>
) {
  const client = getStorageClient();
  const web3Res = await client.get(cid);
  if (web3Res) {
    console.log(`Got a response! [${web3Res.status}] ${web3Res.statusText}`); // TODO: remove
    if (!web3Res.ok) {
      throw new Error(
        `failed to get ${cid} - [${web3Res.status}] ${web3Res.statusText}`
      );
    }

    // unpack File objects from the response
    const files = await web3Res.files();
    for (const file of files) {
      console.log(`${file.cid} -- ${file.name} -- ${file.size}`);
    }

    res.status(200).json({});
  }
}
