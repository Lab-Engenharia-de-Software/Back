/*
  Warnings:

  - You are about to drop the column `minVotosAfavor` on the `urnas` table. All the data in the column will be lost.
  - You are about to drop the column `minVotosContra` on the `urnas` table. All the data in the column will be lost.
  - Added the required column `lastId` to the `urnas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minVotos` to the `urnas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `urnas` DROP COLUMN `minVotosAfavor`,
    DROP COLUMN `minVotosContra`,
    ADD COLUMN `lastId` INTEGER NOT NULL,
    ADD COLUMN `minVotos` INTEGER NOT NULL;
