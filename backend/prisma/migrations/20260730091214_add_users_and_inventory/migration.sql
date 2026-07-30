/*
  Warnings:

  - You are about to drop the `Alert` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Audit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Franchise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InventoryItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MarketingCampaign` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Outlet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sale` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SaleItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Staff` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_outletId_fkey";

-- DropForeignKey
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_outletId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryItem" DROP CONSTRAINT "InventoryItem_outletId_fkey";

-- DropForeignKey
ALTER TABLE "MarketingCampaign" DROP CONSTRAINT "MarketingCampaign_franchiseId_fkey";

-- DropForeignKey
ALTER TABLE "MarketingCampaign" DROP CONSTRAINT "MarketingCampaign_outletId_fkey";

-- DropForeignKey
ALTER TABLE "Outlet" DROP CONSTRAINT "Outlet_franchiseId_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_outletId_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_staffId_fkey";

-- DropForeignKey
ALTER TABLE "SaleItem" DROP CONSTRAINT "SaleItem_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "SaleItem" DROP CONSTRAINT "SaleItem_saleId_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_outletId_fkey";

-- DropTable
DROP TABLE "Alert";

-- DropTable
DROP TABLE "Audit";

-- DropTable
DROP TABLE "Franchise";

-- DropTable
DROP TABLE "InventoryItem";

-- DropTable
DROP TABLE "MarketingCampaign";

-- DropTable
DROP TABLE "Outlet";

-- DropTable
DROP TABLE "Sale";

-- DropTable
DROP TABLE "SaleItem";

-- DropTable
DROP TABLE "Staff";

-- CreateTable
CREATE TABLE "expenses" (
    "expense_id" SERIAL NOT NULL,
    "outlet_id" INTEGER NOT NULL,
    "expense_type" VARCHAR(50),
    "amount" DECIMAL(12,2),
    "expense_date" DATE,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("expense_id")
);

-- CreateTable
CREATE TABLE "managers" (
    "manager_id" SERIAL NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(15),
    "experience_years" INTEGER,
    "joining_date" DATE,
    "status" VARCHAR(20) DEFAULT 'Active',

    CONSTRAINT "managers_pkey" PRIMARY KEY ("manager_id")
);

-- CreateTable
CREATE TABLE "monthly_targets" (
    "target_id" SERIAL NOT NULL,
    "outlet_id" INTEGER NOT NULL,
    "month" VARCHAR(20),
    "target_amount" DECIMAL(12,2),
    "achieved_amount" DECIMAL(12,2),
    "achievement_percentage" DECIMAL(5,2),

    CONSTRAINT "monthly_targets_pkey" PRIMARY KEY ("target_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notification_id" SERIAL NOT NULL,
    "outlet_id" INTEGER,
    "title" VARCHAR(150),
    "message" TEXT,
    "notification_type" VARCHAR(30),
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "outlet_health" (
    "health_id" SERIAL NOT NULL,
    "outlet_id" INTEGER NOT NULL,
    "inventory_score" INTEGER,
    "staff_score" INTEGER,
    "sales_score" INTEGER,
    "customer_score" INTEGER,
    "overall_health_score" INTEGER,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outlet_health_pkey" PRIMARY KEY ("health_id")
);

-- CreateTable
CREATE TABLE "outlet_ratings" (
    "rating_id" SERIAL NOT NULL,
    "outlet_id" INTEGER NOT NULL,
    "customer_name" VARCHAR(100),
    "rating" DECIMAL(2,1),
    "feedback" TEXT,
    "review_date" DATE,

    CONSTRAINT "outlet_ratings_pkey" PRIMARY KEY ("rating_id")
);

-- CreateTable
CREATE TABLE "outlets" (
    "outlet_id" SERIAL NOT NULL,
    "outlet_name" VARCHAR(100) NOT NULL,
    "franchise_name" VARCHAR(100),
    "manager_id" INTEGER,
    "city" VARCHAR(50),
    "state" VARCHAR(50),
    "address" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "opening_date" DATE,
    "status" VARCHAR(20) DEFAULT 'Active',

    CONSTRAINT "outlets_pkey" PRIMARY KEY ("outlet_id")
);

-- CreateTable
CREATE TABLE "performance" (
    "performance_id" SERIAL NOT NULL,
    "outlet_id" INTEGER NOT NULL,
    "month" VARCHAR(20),
    "target_revenue" DECIMAL(12,2),
    "actual_revenue" DECIMAL(12,2),
    "growth_percentage" DECIMAL(5,2),
    "performance_score" INTEGER,

    CONSTRAINT "performance_pkey" PRIMARY KEY ("performance_id")
);

-- CreateTable
CREATE TABLE "sales" (
    "sale_id" SERIAL NOT NULL,
    "outlet_id" INTEGER NOT NULL,
    "sale_date" DATE NOT NULL,
    "revenue" DECIMAL(12,2) DEFAULT 0,
    "orders" INTEGER DEFAULT 0,
    "customers" INTEGER DEFAULT 0,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("sale_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" VARCHAR(20) DEFAULT 'manager',
    "outlet_id" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "item_id" SERIAL NOT NULL,
    "outlet_id" INTEGER NOT NULL,
    "sku" VARCHAR(30) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "category" VARCHAR(50),
    "unit" VARCHAR(20),
    "quantity" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "reorder_at" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "supplier" VARCHAR(100),
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("item_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "managers_email_key" ON "managers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "fk_expense_outlet" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "monthly_targets" ADD CONSTRAINT "fk_target_outlet" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "fk_notification_outlet" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "outlet_health" ADD CONSTRAINT "fk_health_outlet" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "outlet_ratings" ADD CONSTRAINT "fk_rating_outlet" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "outlets" ADD CONSTRAINT "fk_manager" FOREIGN KEY ("manager_id") REFERENCES "managers"("manager_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "performance" ADD CONSTRAINT "fk_performance_outlet" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "fk_sales_outlet" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_user_outlet" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "fk_inventory_outlet" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE CASCADE ON UPDATE NO ACTION;
