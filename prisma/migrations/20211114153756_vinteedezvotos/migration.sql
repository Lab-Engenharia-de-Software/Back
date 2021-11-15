/*
  Warnings:

  - You are about to drop the column `votos` on the `votepresident` table. All the data in the column will be lost.
  - Added the required column `votosAfavor` to the `votePresident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `votosContra` to the `votePresident` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `votepresident` DROP COLUMN `votos`,
    ADD COLUMN `votosAfavor` INTEGER NOT NULL,
    ADD COLUMN `votosContra` INTEGER NOT NULL;
