/*
  Warnings:

  - You are about to drop the column `qualificationRoundId` on the `QualificationResult` table. All the data in the column will be lost.
  - You are about to drop the `QualificationRound` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `eventId` to the `QualificationResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QualificationResult" DROP CONSTRAINT "QualificationResult_qualificationRoundId_fkey";

-- DropForeignKey
ALTER TABLE "QualificationRound" DROP CONSTRAINT "QualificationRound_eventId_fkey";

-- AlterTable
ALTER TABLE "QualificationResult" DROP COLUMN "qualificationRoundId",
ADD COLUMN     "eventId" TEXT NOT NULL;

-- DropTable
DROP TABLE "QualificationRound";

-- AddForeignKey
ALTER TABLE "QualificationResult" ADD CONSTRAINT "QualificationResult_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
