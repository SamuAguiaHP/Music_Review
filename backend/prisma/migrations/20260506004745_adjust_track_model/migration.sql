/*
  Warnings:

  - You are about to drop the `Track` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_track_id_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_album_id_fkey";

-- DropTable
DROP TABLE "Track";

-- CreateTable
CREATE TABLE "tracks" (
    "id" TEXT NOT NULL,
    "id_spotify" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "track_number" INTEGER,
    "duration" INTEGER,
    "userId" TEXT NOT NULL,
    "album_id" TEXT,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tracks_id_spotify_userId_key" ON "tracks"("id_spotify", "userId");

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
