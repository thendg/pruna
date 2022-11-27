import { NextApiRequest, NextApiResponse } from "next";
import { getIPFSFromDirectory, listIPFSDirectory } from "../utils";

type FeatureJSONResponse = {
    labelsFile: JSON
}

type PhotosFile = {
    // ???
}

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
        const featuresDir = await getIPFSFromDirectory(cid as string, "features");
        const files = await listIPFSDirectory(featuresDir.cid);
        if (!files) throw Error(`No files returned from CID: ${cid}`);

        // Retrieve a feature at random.
        const randFeaturesFile = files[Math.floor(Math.random() * files.length)];
        
        // Get the labels.json file.
        const allFiles = await listIPFSDirectory(cid[0]); // ?
        if (!files) throw Error(`No files returned from CID: ${cid}`);
        let labelsFile = null;
        for(let i=0; i<allFiles.length; ++i){
            if(allFiles[i].name === "labels.json"){
                labelsFile = allFiles[i];
                break;
            }
        }
        console.log(labelsFile);
        /* if(labelsFile){
            res.status(200).json({ labelsFile, randFeaturesFile });
        } */
    } catch (err: any) {
        res.status(500).send(err);
    }

}