-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePicture" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnverifiedUser" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePicture" TEXT NOT NULL,

    CONSTRAINT "UnverifiedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResetPasswordToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ResetPasswordToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfirmEmailToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "unverifiedUserId" INTEGER NOT NULL,

    CONSTRAINT "ConfirmEmailToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UnverifiedUser_username_key" ON "UnverifiedUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UnverifiedUser_email_key" ON "UnverifiedUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ResetPasswordToken_token_key" ON "ResetPasswordToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ResetPasswordToken_userId_key" ON "ResetPasswordToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ConfirmEmailToken_token_key" ON "ConfirmEmailToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ConfirmEmailToken_unverifiedUserId_key" ON "ConfirmEmailToken"("unverifiedUserId");

-- AddForeignKey
ALTER TABLE "ResetPasswordToken" ADD CONSTRAINT "ResetPasswordToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmEmailToken" ADD CONSTRAINT "ConfirmEmailToken_unverifiedUserId_fkey" FOREIGN KEY ("unverifiedUserId") REFERENCES "UnverifiedUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
