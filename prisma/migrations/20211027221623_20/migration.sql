/*
  Warnings:

  - Added the required column `qntEspecies` to the `bioterios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `bioterios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bioterios` ADD COLUMN `qntEspecies` INTEGER NOT NULL,
    ADD COLUMN `status` VARCHAR(255) NOT NULL;
