/*
  Warnings:

  - A unique constraint covering the columns `[eventId,registrationId]` on the table `QualificationResult` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "QualificationResult_eventId_registrationId_key" ON "QualificationResult"("eventId", "registrationId");
