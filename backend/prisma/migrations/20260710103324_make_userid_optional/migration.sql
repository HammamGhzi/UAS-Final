/*
  Warnings:

  - Made the column `userId` on table `spk_sessions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `spk_sessions` MODIFY `userId` INTEGER NOT NULL;
