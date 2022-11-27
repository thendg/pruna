import { NextApiRequest, NextApiResponse } from "next";
import { listIPFSDirectory } from "../utils";

export type FeatureJSONResponse = {
  cid: string;
};

const featuresPrefix = new RegExp("^features/.*", "g");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FeatureJSONResponse | string>
) {
  if (req.method !== "GET") {
    res.status(400).send("Bad HTTP method");
    return;
  }

  const { cid } = req.query;
  if (!cid) {
    res.status(400).send("No CID supplied in query");
    return;
  }

  try {
    // Get the features of the given CID.
    const files = await listIPFSDirectory(cid as string);

    files.filter((file) => file.name.match(featuresPrefix));
    if (!files) throw Error(`No files returned from CID: ${cid}`);

    // Retrieve a feature at random.
    const index = Math.floor(Math.random() * files.length);
    res.status(200).json({ cid: files[index].cid });
  } catch (err: any) {
    res.status(500).send(err);
  }
}
