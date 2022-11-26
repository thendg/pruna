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

async function get(
  req: NextApiRequest,
  res: NextApiResponse<BatchJSONResponse | string>
) {
  const { cid } = req.query;
  if (!cid) {
    res.status(400).send("No CID supplied in query");
    return;
  }

  const client = getStorageClient();
  const web3Res = await client.get(cid as string);
  if (web3Res) {
    if (!web3Res.ok) {
      res
        .status(400)
        .send(
          `failed to get ${cid} - [${web3Res.status}] ${web3Res.statusText}`
        );
      return;
    }

    const files = await web3Res.files();
    const batch = [];
    for (const file of files) {
      batch.push({ path: file.name, CID: file.cid });
    }

    res.status(200).json({ batch });
  } else res.status(500).send("Failed to get response from Web3.Storage");
}

async function post(
  req: NextApiRequest,
  res: NextApiResponse<BatchJSONResponse | string>
) {}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BatchJSONResponse | string>
) {
  if (req.method === "GET") await get(req, res);
  else if (req.method === "POST") await post(req, res);
  else res.status(400).send("Bad HTTP method");
}
