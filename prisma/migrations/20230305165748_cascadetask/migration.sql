-- DropForeignKey
ALTER TABLE "task_comments" DROP CONSTRAINT "task_comments_task_id_fkey";

-- AddForeignKey
ALTER TABLE "task_comments" ADD CONSTRAINT "task_comments_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
