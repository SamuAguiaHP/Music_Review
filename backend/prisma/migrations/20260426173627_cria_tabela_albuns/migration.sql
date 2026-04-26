/*
  Warnings:

  - A unique constraint covering the columns `[id_spotify]` on the table `Album` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_spotify` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "id_spotify" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "duration" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Album_id_spotify_key" ON "Album"("id_spotify");
