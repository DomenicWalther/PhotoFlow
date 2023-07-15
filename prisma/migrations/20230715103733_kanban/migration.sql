-- CreateTable
CREATE TABLE "KanbanCard" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completion_Date" TIMESTAMP(3) NOT NULL,
    "taskName" TEXT NOT NULL,
    "taskDescription" TEXT NOT NULL,
    "taskColumn" TEXT NOT NULL,

    CONSTRAINT "KanbanCard_pkey" PRIMARY KEY ("id")
);
