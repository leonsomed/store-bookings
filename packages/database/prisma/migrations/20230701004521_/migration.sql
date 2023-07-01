/*
  Warnings:

  - The values [newCourseProductLog] on the enum `ActivityLogType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `OptionalStripeChargeId` on the `ActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `OptionalStripeCustomerId` on the `ActivityLog` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActivityLogType_new" AS ENUM ('transactionLog', 'updateByItemPriceLog', 'scheduleLessonItemLog', 'cancelScheduleLessonItemLog', 'releaseItemFundsLog', 'cancelReleaseItemFundsLog', 'voidItemLog', 'cancelVoidItemLog', 'setItemRegionLog', 'newLessonItemLog', 'newCourseItemLog');
ALTER TABLE "ActivityLog" ALTER COLUMN "type" TYPE "ActivityLogType_new" USING ("type"::text::"ActivityLogType_new");
ALTER TYPE "ActivityLogType" RENAME TO "ActivityLogType_old";
ALTER TYPE "ActivityLogType_new" RENAME TO "ActivityLogType";
DROP TYPE "ActivityLogType_old";
COMMIT;

-- AlterTable
ALTER TABLE "ActivityLog" DROP COLUMN "OptionalStripeChargeId",
DROP COLUMN "OptionalStripeCustomerId",
ADD COLUMN     "itemId" TEXT,
ADD COLUMN     "optionalStripeChargeId" TEXT,
ADD COLUMN     "optionalStripeCustomerId" TEXT;

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "geo" geometry(Polygon, 4326);
