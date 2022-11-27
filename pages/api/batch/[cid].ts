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
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // TODO implement singleton?

export type BatchFile = {
  path: string;
  CID: string;
};

export type BatchJSONResponse = {
  batch: BatchFile[];
};

export type PrunaJSON = {
  type: "icb";
  pruners: number;
  threshold: number;
};

function getStorageClient() {
  return new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN! });
}

async function getIPFSFile(cid: string) {
  const res = await fetch(
    `https://api.ipfsbrowser.com/ipfs/get.php?hash=${cid}`
  );
  return await res.json();
}

async function listIPFSDirectory(cid: string) {
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

async function getIPFSFromDirectory(directoryCID: string, filename: string) {
  const files = await listIPFSDirectory(directoryCID as string);

  const file = files.find((file) => file.name == filename);
  if (!file) throw Error(`Failed to find ${directoryCID}/${filename}`);
  return file;
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

  try {
    const files = await listIPFSDirectory(cid as string);
    if (!files) throw Error(`No files returned from CID: ${cid}`);
    const batch = [];
    for (const file of files) batch.push({ path: file.name, CID: file.cid });
    res.status(200).json({ batch });
  } catch (err: any) {
    res.status(500).send(err);
  }
}

async function post(
  req: NextApiRequest,
  res: NextApiResponse<BatchJSONResponse | string>
) {
  const { cid } = req.query;
  if (!cid) {
    res.status(400).send("No CID supplied in query");
    return;
  }

  try {
    const prunaJSONFile = await getIPFSFromDirectory(
      cid as string,
      "pruna.json"
    );
    const prunaJSON: PrunaJSON = await getIPFSFile(prunaJSONFile.cid);

    await prisma.batch.create({
      data: {
        origin: cid as string,
        pruners: prunaJSON.pruners,
        threshold: prunaJSON.threshold,
      },
    });

    res.status(200);
  } catch (err: any) {
    res.status(500).send(err);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BatchJSONResponse | string>
) {
  if (req.method === "GET") await get(req, res);
  else if (req.method === "POST") await post(req, res);
  else res.status(400).send("Bad HTTP method");
}
