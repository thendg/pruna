-- CreateTable
CREATE TABLE "Vote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "feature" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "vote" BOOLEAN NOT NULL,
    "batchId" TEXT NOT NULL,
    CONSTRAINT "Vote_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch" ("origin") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BatchWinners" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "batchwinnersId" TEXT NOT NULL,
    CONSTRAINT "BatchWinners_batchwinnersId_fkey" FOREIGN KEY ("batchwinnersId") REFERENCES "Batch" ("origin") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Batch" (
    "origin" TEXT NOT NULL PRIMARY KEY,
    "pruners" INTEGER NOT NULL,
    "threshold" INTEGER NOT NULL
);
