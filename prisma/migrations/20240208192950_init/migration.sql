-- CreateTable
CREATE TABLE "task_comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "task_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    CONSTRAINT "task_comments_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Tasks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tasks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueAt" DATETIME NOT NULL,
    "task" TEXT NOT NULL,
    "additional_information" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "is_finished" BOOLEAN NOT NULL DEFAULT false,
    "amount_of_comments" INTEGER NOT NULL DEFAULT 0,
    "taskColumn" TEXT NOT NULL DEFAULT '1'
);

-- CreateTable
CREATE TABLE "KanbanCard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completion_Date" DATETIME NOT NULL,
    "taskName" TEXT NOT NULL,
    "taskDescription" TEXT NOT NULL,
    "taskColumn" TEXT NOT NULL
);
