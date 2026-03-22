-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HurtEntry" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "writerId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,

    CONSTRAINT "HurtEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoundaryMessage" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "writerId" TEXT NOT NULL,

    CONSTRAINT "BoundaryMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Saying" (
    "id" TEXT NOT NULL,
    "textHe" TEXT NOT NULL,
    "textEn" TEXT NOT NULL,
    "author" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Saying_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "altTextHe" TEXT,
    "altTextEn" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participant_label_key" ON "Participant"("label");

-- CreateIndex
CREATE INDEX "HurtEntry_writerId_idx" ON "HurtEntry"("writerId");

-- CreateIndex
CREATE INDEX "HurtEntry_targetId_idx" ON "HurtEntry"("targetId");

-- CreateIndex
CREATE INDEX "BoundaryMessage_writerId_idx" ON "BoundaryMessage"("writerId");

-- AddForeignKey
ALTER TABLE "HurtEntry" ADD CONSTRAINT "HurtEntry_writerId_fkey" FOREIGN KEY ("writerId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HurtEntry" ADD CONSTRAINT "HurtEntry_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoundaryMessage" ADD CONSTRAINT "BoundaryMessage_writerId_fkey" FOREIGN KEY ("writerId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
