-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_mapId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "description" TEXT,
ALTER COLUMN "mapId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE SET NULL ON UPDATE CASCADE;
