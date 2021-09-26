/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `adm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `nome` VARCHAR(255) NOT NULL,
    `cpf` VARCHAR(255) NOT NULL,
    `telefone` VARCHAR(255) NOT NULL,
    `endereco` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `adm_email_key`(`email`),
    UNIQUE INDEX `adm_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
