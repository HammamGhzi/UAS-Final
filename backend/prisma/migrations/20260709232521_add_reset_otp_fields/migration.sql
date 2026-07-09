-- AlterTable
ALTER TABLE `users` ADD COLUMN `resetOtp` VARCHAR(6) NULL,
    ADD COLUMN `resetOtpExpiry` DATETIME(3) NULL;
