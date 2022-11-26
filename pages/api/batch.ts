export type BatchFile = {
  path: string;
  CID: string;
};

export type BatchJSONResponse = {
  batch: BatchFile[];
};
