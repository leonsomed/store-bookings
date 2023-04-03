/*
  Warnings:

  - Added the required column `authorId` to the `ActivityLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActivityLog" ADD COLUMN     "authorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "coords" DROP NOT NULL;
