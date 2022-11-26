# Pruna
> *A blockchain based data cleaning service that can guarantee up to 100% accuracy in large datasets with lightning fast turnaround times.*

Pruna is a system which "prunes" classification datasets, indentifying false classifications to ensure up to 100% accuracy in any dataset it is given. This service could be used in cases where datasets are used for high-stakes scenarios, for example evaulating the validity of a dataset being used to train machine learning models that classify medical conditions or image classification for critical systems. In these cases, bad data can make a big difference so owners or users of this data would have a big incentive to clean it before its used for anything. Vendors could use the service to ensure clean, high accuracy datasets without requiring monotonous, tedious manual labour and data scientists could utilise the system to prepare data before usage, improving the perfomance or accuracy of the task the data is being used for.

The system refers to these datasets as "batches" and as a "batch owner", I can approach the system with the desire for my data to be pruned. I pay the batch fee (a base fee required by Pruna) for my batch to be accepted, then it is added to the "batch pool", the set of accepted batches awaiting pruning.

Normally, cleaning data is a long, repetitive, painfully boring and wasteful task, Pruna utilises its userbase to clean data batches by gameifying the experience, making the task fun whilst also productive as the process of playing Pruna's games identifies classification errors in batches. This way, players can enjoy their time as they contribute to community, assisting the pruning of data that can be used to better the world.

All batch owners pay the same batch fee (proportional to their size), so all batches are equal in terms of their relative batch fee. To incentivise faster processing for my batch, I can present a "batch reward" alongside my fee which is rewarded to the winners of my batch. This incentivises players to play my batch over other batches, speeding up the pruning time of my batch.

## The Arcade
TODO: what's the game???


## Encoders
The key to the system is finding ways to encode different forms of batch data into the decisions that players can make in games, such that their decision reflects the correctness of the piece of data in question. Pruna 1.0 currently implements an image classification encoder which gamifies data from iamge classification batches. In terms of future prospects, Pruna's games are designed to work generically and abstractly in relation to the batch data provided to them. Therefore, by design, to extend functionality into new forms of batch data, all that's required is a new encoder to bring that form of batch data into the games.

## Batches
A batch is a dataset entered into the system, stored externally as a directory in IPFS. When adding a new batch, the IFPS CID referencing this directory is supplied to Pruna. All batches have a `pruna.json` file at the root of this directory, containing metadata about the batch which is used when processing the batch in the system. There are different types of batches which may be organised differently but will all have `pruna.json` at the root. Pruna currently has encoders for the following batch types:

### Image Classification Batches (*ICB*)
**Image Classification Batches** represent datasets of classified image data. An ICB is arranged as follows:
```
- features
  - 001.png 
  - 002.png 
  - 003.png
- labels.json
- pruna.json
```

The `features` directory contains the features (images) of the dataset. `labels.json` contains the labels of the dataset in JSON format and is arranged as follows:
```json
// labels.json

{
    "names": {
        "0": "dog",
        "1": "cat"
    },
    "labels": {
        "001": "0",
        "002": "0",
        "003": "1",
    }
}
```

Finally, `pruna.json` will contain the metadata of the batch:
```json
// pruna.json

{
    "type": "icb",
    "pruners": 5,
    "threshold": 4, 
}
```

The `pruners` field denotes how many pruners a single label should be tested against before the system decides it to be valid or invalid. `threshold` denotes the minimum number of pruners who have to agree with the label for a label to be accepted as valid. When all labels have been tested against the number of pruners specified in `pruners`, the batch has reached "pruning conditions" and is considered pruned.

To submit a batch, owners enter the IPFS CID of the batch directory. Pruna will then parse the batch and create a representation for it, in it's blockchain-based backend services.

## The Backend
When a batch is accepted it is added to the batch pool, but what does this actually look like computationally? The backend of the application is managed by smart contracts on the Tezos blockchain, which track the pruning progress of different batches and mint NFTs for batch owners proving that a batch *has* been pruned in respect to the system.

The minted NFT is a certificate, generated by Pruna when a batch has been pruned. The certificate lists:

- Pruning Conditions
  - An accuracy rating between 0 and 1 showing the level of accuracy stated by Pruna's data cleaning process used on the given batch.
  - The batch's pruning conditions shown as ([`pruners`]/[`threshold`]). This information is useful because the accuracy rating alone can be misleading. For example, The conditions  1/1 and 100/100 both have a threshold of 1.0, but a batch pruned under 100/100 conditions is clearly much more reliable.
- A hash of the features present in the batch at the time of pruning. This prevents the dataset being edited after the prune has been approved since a hash taken from an edited dataset will not match the hash displayed in the original certificate.
- A QR code directing users to a batch's smart contract's address on a Tezos block explorer.

This certificate proves that Pruna has pruned the batch and is stating the information listed in the certificate to be true.

Pruna dynamically deploys a smart contract to hold and perform processing on the pruning progress data for each batch. This reduces the fees of interacting with batches each batch is stored separately, so that users don't pay gas for storage used by contracts they have nothing to do with. This increases the cost and network efficiency of the system with minimal loss due to the high efficiency of the Tezos network.

These contracts have the following fields:
- `origin` - An IPFS CID reference to the original data provided when the batch was added.
- `data` - A collection mapping feature names.
- `pruners` - The value from the `pruners` field of the batch's pruning conditions.
- `threshold` - The value from the `threshold` field of the batch's pruning conditions.
- `winners` - A list of addresses who have won pruning games for this batch, these are the players who will receive rewards when the batch is pruned.

The batch's reward is held in the contract's internal balance. Batch rewards are distributed to winners *after* a batch is pruned. This incentivises players to work through batches faster, improving the turnaround time of pruning batches.

## Roadmap
- Implement hash verification to show that the current hash of a batch matches its certificate hash.