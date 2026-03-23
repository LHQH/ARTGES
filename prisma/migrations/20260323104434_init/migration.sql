-- CreateTable
CREATE TABLE `Address` (
    `id_address` INTEGER NOT NULL AUTO_INCREMENT,
    `way_number` VARCHAR(191) NULL,
    `street_name` VARCHAR(191) NULL,
    `postcode` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `id_craftman` INTEGER NOT NULL,

    PRIMARY KEY (`id_address`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bill` (
    `id_bill` INTEGER NOT NULL AUTO_INCREMENT,
    `billTitle` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(191) NOT NULL,
    `tva` DECIMAL(65, 30) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `QTY` DOUBLE NOT NULL,
    `unitAmount` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_estimate` INTEGER NULL,
    `id_craftman` INTEGER NOT NULL,

    PRIMARY KEY (`id_bill`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id_client` INTEGER NOT NULL AUTO_INCREMENT,
    `last_name` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
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
    `id_record` INTEGER NULL,
    `id_bill` INTEGER NULL,
    `id_address` INTEGER NULL,
    `id_client` INTEGER NULL,
    `id_craftman` INTEGER NULL,

    PRIMARY KEY (`id_construct`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Craftman` (
    `id_craftman` INTEGER NOT NULL AUTO_INCREMENT,
    `company_name` VARCHAR(191) NULL,
    `SIRET` VARCHAR(191) NULL,
    `socialReason` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `first_name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `logo_url` VARCHAR(191) NOT NULL,
    `hash_password` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Craftman_email_key`(`email`),
    PRIMARY KEY (`id_craftman`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Estimate` (
    `id_estimate` INTEGER NOT NULL AUTO_INCREMENT,
    `reference` VARCHAR(191) NOT NULL,
    `tva` DECIMAL(65, 30) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `QTY` DOUBLE NOT NULL,
    `unitAmount` DOUBLE NOT NULL,
    `status_estimate` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_craftman` INTEGER NULL,

    PRIMARY KEY (`id_estimate`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id_event` INTEGER NOT NULL AUTO_INCREMENT,
    `start_datetime` DATETIME(3) NOT NULL,
    `end_datetime` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NULL,
    `type_rdv_intervention_visite_` VARCHAR(191) NOT NULL,
    `id_craftman` INTEGER NULL,

    PRIMARY KEY (`id_event`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Purchase` (
    `id_purchase` INTEGER NOT NULL AUTO_INCREMENT,
    `purchase_date` DATETIME(3) NOT NULL,
    `supplier_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_construct` INTEGER NOT NULL,

    PRIMARY KEY (`id_purchase`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Record` (
    `id_record` INTEGER NOT NULL AUTO_INCREMENT,
    `file_name` VARCHAR(191) NOT NULL,
    `file_url` VARCHAR(191) NOT NULL,
    `type_estimate_bill_` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_client` INTEGER NULL,
    `id_craftman` INTEGER NULL,

    PRIMARY KEY (`id_record`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_id_craftman_fkey` FOREIGN KEY (`id_craftman`) REFERENCES `Craftman`(`id_craftman`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bill` ADD CONSTRAINT `Bill_id_estimate_fkey` FOREIGN KEY (`id_estimate`) REFERENCES `Estimate`(`id_estimate`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bill` ADD CONSTRAINT `Bill_id_craftman_fkey` FOREIGN KEY (`id_craftman`) REFERENCES `Craftman`(`id_craftman`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_id_address_fkey` FOREIGN KEY (`id_address`) REFERENCES `Address`(`id_address`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_id_craftman_fkey` FOREIGN KEY (`id_craftman`) REFERENCES `Craftman`(`id_craftman`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Construct` ADD CONSTRAINT `Construct_id_record_fkey` FOREIGN KEY (`id_record`) REFERENCES `Record`(`id_record`) ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE `Event` ADD CONSTRAINT `Event_id_craftman_fkey` FOREIGN KEY (`id_craftman`) REFERENCES `Craftman`(`id_craftman`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Purchase` ADD CONSTRAINT `Purchase_id_construct_fkey` FOREIGN KEY (`id_construct`) REFERENCES `Construct`(`id_construct`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Record` ADD CONSTRAINT `Record_id_client_fkey` FOREIGN KEY (`id_client`) REFERENCES `Client`(`id_client`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Record` ADD CONSTRAINT `Record_id_craftman_fkey` FOREIGN KEY (`id_craftman`) REFERENCES `Craftman`(`id_craftman`) ON DELETE SET NULL ON UPDATE CASCADE;
