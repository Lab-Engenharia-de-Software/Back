-- CreateTable
CREATE TABLE `votePresident` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `votos` INTEGER NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `pesquisadorId` INTEGER NOT NULL,

    UNIQUE INDEX `votePresident_pesquisadorId_unique`(`pesquisadorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `votePresident` ADD CONSTRAINT `votePresident_pesquisadorId_fkey` FOREIGN KEY (`pesquisadorId`) REFERENCES `pesquisadores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
