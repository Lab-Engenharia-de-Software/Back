/*
  Warnings:

  - You are about to drop the `votepresident` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `votepresident` DROP FOREIGN KEY `votePresident_pesquisadorId_fkey`;

-- DropTable
DROP TABLE `votepresident`;

-- CreateTable
CREATE TABLE `urnas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `candidatoId` INTEGER NOT NULL,
    `qntVotoSim` INTEGER NOT NULL,
    `qntVotoNao` INTEGER NOT NULL,
    `minVotosAfavor` INTEGER NOT NULL,
    `minVotosContra` INTEGER NOT NULL,

    UNIQUE INDEX `urnas_candidatoId_unique`(`candidatoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `votos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `voto` INTEGER NOT NULL,
    `urnaId` INTEGER NOT NULL,
    `eleitorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `urnas` ADD CONSTRAINT `urnas_candidatoId_fkey` FOREIGN KEY (`candidatoId`) REFERENCES `pesquisadores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `votos` ADD CONSTRAINT `votos_eleitorId_fkey` FOREIGN KEY (`eleitorId`) REFERENCES `pesquisadores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `votos` ADD CONSTRAINT `votos_urnaId_fkey` FOREIGN KEY (`urnaId`) REFERENCES `urnas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
