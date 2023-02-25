CREATE SCHEMA IF NOT EXISTS "extensions";

CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "extensions";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'student');

-- CreateEnum
CREATE TYPE "LessonRole" AS ENUM ('driver', 'observer');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('lesson', 'course');

-- CreateEnum
CREATE TYPE "ProductId" AS ENUM ('dmvLesson', 'driver1', 'driver2', 'observer1', 'observer2', 'course');

-- CreateEnum
CREATE TYPE "BundleId" AS ENUM ('standard6', 'standard10', 'de6', 'de10', 'standard7x7');

-- CreateEnum
CREATE TYPE "PriceSchemeRule" AS ENUM ('percentageIncrease', 'percentageDecrease', 'centsIncrease', 'centsDecrease');

-- CreateEnum
CREATE TYPE "State" AS ENUM ('california', 'texas');

-- CreateEnum
CREATE TYPE "VoidReason" AS ENUM ('noShow', 'expired', 'other');

-- CreateEnum
CREATE TYPE "TransactionCategory" AS ENUM ('stripe', 'cash');

-- CreateEnum
CREATE TYPE "Initiator" AS ENUM ('student', 'instructor', 'support');

-- CreateEnum
CREATE TYPE "ActivityLogType" AS ENUM ('transactionLog', 'updateByProductPriceLog', 'scheduleLessonProductLog', 'cancelScheduleLessonProductLog', 'releaseProductFundsLog', 'cancelReleaseProductFundsLog', 'voidProductLog', 'cancelVoidProductLog', 'setProductRegionLog', 'newLessonProductLog', 'newCourseProductLog');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "addressId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "street2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "coords" extensions.geometry(Point, 4326) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instructor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Instructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonSlot" (
    "id" TEXT NOT NULL,
    "startTimestamp" TIMESTAMP(3) NOT NULL,
    "endTimestamp" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "instructorId" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "studentId" TEXT,

    CONSTRAINT "LessonSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountsOnUsers" (
    "accountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "AccountsOnUsers_pkey" PRIMARY KEY ("accountId","userId")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" "ProductId" NOT NULL,
    "type" "ProductType" NOT NULL,
    "role" "LessonRole",
    "durationMinutes" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bundle" (
    "id" "BundleId" NOT NULL,

    CONSTRAINT "Bundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductOnBundle" (
    "bundleId" "BundleId" NOT NULL,
    "productId" "ProductId" NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "ProductOnBundle_pkey" PRIMARY KEY ("bundleId","productId")
);

-- CreateTable
CREATE TABLE "PriceScheme" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "PriceScheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductOnPriceScheme" (
    "priceSchemeId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "cents" INTEGER NOT NULL,

    CONSTRAINT "ProductOnPriceScheme_pkey" PRIMARY KEY ("priceSchemeId","itemId")
);

-- CreateTable
CREATE TABLE "PriceModifierOnPriceScheme" (
    "id" TEXT NOT NULL,
    "priceSchemeId" TEXT NOT NULL,
    "itemId" TEXT,
    "rule" "PriceSchemeRule" NOT NULL,
    "cents" INTEGER NOT NULL,
    "percentage" INTEGER NOT NULL,

    CONSTRAINT "PriceModifierOnPriceScheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priceSchemeId" TEXT NOT NULL,
    "geo" extensions.geometry(Polygon, 4326) NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "type" "ActivityLogType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "transactionCategory" "TransactionCategory",
    "cents" INTEGER,
    "OptionalStripeChargeId" TEXT,
    "OptionalStripeCustomerId" TEXT,
    "productId" "ProductId",
    "centsDiff" INTEGER,
    "instructorId" TEXT,
    "studentId" TEXT,
    "slotId" TEXT,
    "initiator" "Initiator",
    "reason" "VoidReason",
    "regionId" TEXT,
    "productType" "ProductType",
    "role" "LessonRole",
    "durationMinutes" INTEGER,
    "state" "State",

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "coords_idx" ON "Address" USING GIST ("coords");

-- CreateIndex
CREATE UNIQUE INDEX "Instructor_userId_key" ON "Instructor"("userId");

-- CreateIndex
CREATE INDEX "geo_idx" ON "Region" USING GIST ("geo");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSlot" ADD CONSTRAINT "LessonSlot_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSlot" ADD CONSTRAINT "LessonSlot_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSlot" ADD CONSTRAINT "LessonSlot_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountsOnUsers" ADD CONSTRAINT "AccountsOnUsers_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountsOnUsers" ADD CONSTRAINT "AccountsOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOnBundle" ADD CONSTRAINT "ProductOnBundle_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOnBundle" ADD CONSTRAINT "ProductOnBundle_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceScheme" ADD CONSTRAINT "PriceScheme_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "PriceScheme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_priceSchemeId_fkey" FOREIGN KEY ("priceSchemeId") REFERENCES "PriceScheme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
