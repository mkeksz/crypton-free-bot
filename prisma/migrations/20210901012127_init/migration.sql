-- CreateTable
CREATE TABLE "User" (
    "telegramID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "step" TEXT
);

-- CreateTable
CREATE TABLE "Section" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL,
    "textButton" TEXT NOT NULL,
    "alwaysAvailable" BOOLEAN NOT NULL DEFAULT false,
    "parentSectionID" INTEGER,
    FOREIGN KEY ("parentSectionID") REFERENCES "Section" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserCompletedSection" (
    "sectionID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,
    "fullCompleted" BOOLEAN NOT NULL DEFAULT false,
    "stars" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("sectionID", "userID"),
    FOREIGN KEY ("sectionID") REFERENCES "Section" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("userID") REFERENCES "User" ("telegramID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" INTEGER NOT NULL,
    "sectionID" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "media" TEXT,
    "answerButtons" TEXT,
    "answer" TEXT,
    FOREIGN KEY ("sectionID") REFERENCES "Section" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" INTEGER NOT NULL,
    "sectionID" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "buttons" TEXT NOT NULL,
    FOREIGN KEY ("sectionID") REFERENCES "Section" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_OpensSections" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Section" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Section" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_OpensSections_AB_unique" ON "_OpensSections"("A", "B");

-- CreateIndex
CREATE INDEX "_OpensSections_B_index" ON "_OpensSections"("B");
