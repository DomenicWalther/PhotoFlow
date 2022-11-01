/*
  Warnings:

  - Added the required column `additional_information` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "additional_information" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
