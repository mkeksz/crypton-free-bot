-- CreateTable
CREATE TABLE `User` (
    `telegramID` INTEGER NOT NULL,
    `step` VARCHAR(191),

    PRIMARY KEY (`telegramID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Section` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `active` BOOLEAN NOT NULL DEFAULT false,
    `position` INTEGER NOT NULL,
    `textButton` VARCHAR(191) NOT NULL,
    `alwaysAvailable` BOOLEAN NOT NULL DEFAULT false,
    `parentSectionID` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserCompletedSection` (
    `sectionID` INTEGER NOT NULL,
    `userID` INTEGER NOT NULL,
    `fullCompleted` BOOLEAN NOT NULL DEFAULT false,
    `stars` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`sectionID`, `userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lesson` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `position` INTEGER NOT NULL,
    `sectionID` INTEGER NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `media` VARCHAR(191),
    `answerButtons` VARCHAR(191),
    `answer` VARCHAR(191),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quiz` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `position` INTEGER NOT NULL,
    `sectionID` INTEGER NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `buttons` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_OpensSections` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_OpensSections_AB_unique`(`A`, `B`),
    INDEX `_OpensSections_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Section` ADD FOREIGN KEY (`parentSectionID`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCompletedSection` ADD FOREIGN KEY (`sectionID`) REFERENCES `Section`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCompletedSection` ADD FOREIGN KEY (`userID`) REFERENCES `User`(`telegramID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD FOREIGN KEY (`sectionID`) REFERENCES `Section`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quiz` ADD FOREIGN KEY (`sectionID`) REFERENCES `Section`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OpensSections` ADD FOREIGN KEY (`A`) REFERENCES `Section`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OpensSections` ADD FOREIGN KEY (`B`) REFERENCES `Section`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
