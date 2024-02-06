/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `PostImages` table. All the data in the column will be lost.
  - Added the required column `image` to the `PostImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PostImages" DROP COLUMN "imageUrl",
ADD COLUMN     "image" TEXT NOT NULL;
