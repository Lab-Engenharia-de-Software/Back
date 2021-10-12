-- CreateTable
CREATE TABLE `pesquisadores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `nome` VARCHAR(255) NOT NULL,
    `cpf` VARCHAR(255) NOT NULL,
    `telefone` VARCHAR(255) NOT NULL,
    `endereco` VARCHAR(255) NOT NULL,
    `role` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `sexo` VARCHAR(255) NOT NULL,
    `nascimento` DATETIME(0) NOT NULL,
    `area` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `pesquisadores_email_key`(`email`),
    UNIQUE INDEX `pesquisadores_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
