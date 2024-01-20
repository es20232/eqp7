-- AlterTable
ALTER TABLE "UnverifiedUser" ALTER COLUMN "profilePicture" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profilePicture" DROP NOT NULL;
