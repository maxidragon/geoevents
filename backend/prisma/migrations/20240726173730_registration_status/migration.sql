-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DELETED');

-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "status" "RegistrationStatus" NOT NULL DEFAULT 'PENDING';
