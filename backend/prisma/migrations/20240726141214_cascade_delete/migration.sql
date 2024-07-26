-- DropForeignKey
ALTER TABLE "RegistrationHistory" DROP CONSTRAINT "RegistrationHistory_registrationId_fkey";

-- AddForeignKey
ALTER TABLE "RegistrationHistory" ADD CONSTRAINT "RegistrationHistory_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "Registration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
