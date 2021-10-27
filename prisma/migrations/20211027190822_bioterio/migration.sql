-- CreateTable
CREATE TABLE `bioterios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `especies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `bioterioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `especies` ADD CONSTRAINT `especies_bioterioId_fkey` FOREIGN KEY (`bioterioId`) REFERENCES `bioterios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
