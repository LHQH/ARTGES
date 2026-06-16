-- CreateTable
CREATE TABLE `EstimateLine` (
    `id_line` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `qty` DOUBLE NOT NULL,
    `unitAmount` DOUBLE NOT NULL,
    `id_estimate` INTEGER NOT NULL,

    PRIMARY KEY (`id_line`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Address` (
    `id_address` INTEGER NOT NULL AUTO_INCREMENT,
    `street` VARCHAR(191) NULL,
    `postcode` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `id_craftman` INTEGER NOT NULL,

    PRIMARY KEY (`id_address`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bill` (
    `id_bill` INTEGER NOT NULL AUTO_INCREMENT,
    `reference` VARCHAR(191) NOT NULL,
    `tva` DECIMAL(65, 30) NOT NULL,
    `status_bill` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_estimate` INTEGER NULL,
    `id_client` INTEGER NULL,
    `id_craftman` INTEGER NOT NULL,

    PRIMARY KEY (`id_bill`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BillLine` (
    `id_line` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `qty` DOUBLE NOT NULL,
    `unitAmount` DOUBLE NOT NULL,
    `id_bill` INTEGER NOT NULL,

    PRIMARY KEY (`id_line`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id_client` INTEGER NOT NULL AUTO_INCREMENT,
    `lastName` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_address` INTEGER NULL,
    `id_craftman` INTEGER NULL,

    UNIQUE INDEX `Client_email_key`(`email`),
    PRIMARY KEY (`id_client`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Construct` (
    `id_construct` INTEGER NOT NULL AUTO_INCREMENT,
    `construct_ref` VARCHAR(191) NOT NULL,
    `construct_name` VARCHAR(191) NULL,
    `construct_date` DATETIME(3) NULL,
    `description` VARCHAR(191) NULL,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `status` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_bill` INTEGER NULL,
    `id_address` INTEGER NULL,
    `id_client` INTEGER NULL,
    `id_craftman` INTEGER NULL,

    PRIMARY KEY (`id_construct`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Craftman` (
    `id_craftman` INTEGER NOT NULL AUTO_INCREMENT,
    `lastName` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NULL,
    `mail` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `proAdress` VARCHAR(191) NULL,
    `postCode` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `SIRET` VARCHAR(191) NULL,
    `socialReason` VARCHAR(191) NULL,
    `logo_url` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,

    UNIQUE INDEX `Craftman_mail_key`(`mail`),
    PRIMARY KEY (`id_craftman`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Estimate` (
    `id_estimate` INTEGER NOT NULL AUTO_INCREMENT,
    `reference` VARCHAR(191) NOT NULL,
    `tva` DECIMAL(65, 30) NOT NULL,
    `status_estimate` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_craftman` INTEGER NULL,
    `id_client` INTEGER NULL,

    PRIMARY KEY (`id_estimate`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id_event` INTEGER NOT NULL AUTO_INCREMENT,
    `start_datetime` DATETIME(3) NULL,
    `end_datetime` DATETIME(3) NULL,
    `description` VARCHAR(191) NULL,
    `type_rdv_intervention_visite_` VARCHAR(191) NOT NULL,
    `id_craftman` INTEGER NULL,

    PRIMARY KEY (`id_event`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EstimateLine` ADD CONSTRAINT `EstimateLine_id_estimate_fkey` FOREIGN KEY (`id_estimate`) REFERENCES `Estimate`(`id_estimate`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_id_craftman_fkey` FOREIGN KEY (`id_craftman`) REFERENCES `Craftman`(`id_craftman`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bill` ADD CONSTRAINT `Bill_id_estimate_fkey` FOREIGN KEY (`id_estimate`) REFERENCES `Estimate`(`id_estimate`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bill` ADD CONSTRAINT `Bill_id_client_fkey` FOREIGN KEY (`id_client`) REFERENCES `Client`(`id_client`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bill` ADD CONSTRAINT `Bill_id_craftman_fkey` FOREIGN KEY (`id_craftman`) REFERENCES `Craftman`(`id_craftman`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BillLine` ADD CONSTRAINT `BillLine_id_bill_fkey` FOREIGN KEY (`id_bill`) REFERENCES `Bill`(`id_bill`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_id_address_fkey` FOREIGN KEY (`id_address`) REFERENCES `Address`(`id_address`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_id_craftman_fkey` FOREIGN KEY (`id_craftman`) REFERENCES `Craftman`(`id_craftman`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Construct` ADD CONSTRAINT `Construct_id_bill_fkey` FOREIGN KEY (`id_bill`) REFERENCES `Bill`(`id_bill`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Construct` ADD CONSTRAINT `Construct_id_address_fkey` FOREIGN KEY (`id_address`) REFERENCES `Address`(`id_address`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Construct` ADD CONSTRAINT `Construct_id_client_fkey` FOREIGN KEY (`id_client`) REFERENCES `Client`(`id_client`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Construct` ADD CONSTRAINT `Construct_id_craftman_fkey` FOREIGN KEY (`id_craftman`) REFERENCES `Craftman`(`id_craftman`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Estimate` ADD CONSTRAINT `Estimate_id_craftman_fkey` FOREIGN KEY (`id_craftman`) REFERENCES `Craftman`(`id_craftman`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Estimate` ADD CONSTRAINT `Estimate_id_client_fkey` FOREIGN KEY (`id_client`) REFERENCES `Client`(`id_client`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_id_craftman_fkey` FOREIGN KEY (`id_craftman`) REFERENCES `Craftman`(`id_craftman`) ON DELETE SET NULL ON UPDATE CASCADE;
