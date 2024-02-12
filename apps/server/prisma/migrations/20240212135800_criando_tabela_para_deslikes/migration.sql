-- AlterTable
ALTER TABLE "UserPost" ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "PostDeslikes" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PostDeslikes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostDeslikes" ADD CONSTRAINT "PostDeslikes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "UserPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostDeslikes" ADD CONSTRAINT "PostDeslikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
