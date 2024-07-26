/*
  Warnings:

  - You are about to drop the column `performedBy` on the `RegistrationHistory` table. All the data in the column will be lost.
  - Added the required column `performedById` to the `RegistrationHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RegistrationHistory" DROP COLUMN "performedBy",
ADD COLUMN     "performedById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "RegistrationHistory" ADD CONSTRAINT "RegistrationHistory_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
