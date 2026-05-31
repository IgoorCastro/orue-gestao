-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProductSize" ADD VALUE 'PP';
ALTER TYPE "ProductSize" ADD VALUE 'G1';
ALTER TYPE "ProductSize" ADD VALUE 'G2';
ALTER TYPE "ProductSize" ADD VALUE 'G3';
ALTER TYPE "ProductSize" ADD VALUE 'G4';
ALTER TYPE "ProductSize" ADD VALUE 'G5';
ALTER TYPE "ProductSize" ADD VALUE 'L';
ALTER TYPE "ProductSize" ADD VALUE 'XL';
ALTER TYPE "ProductSize" ADD VALUE 'XXL';
ALTER TYPE "ProductSize" ADD VALUE 'XXXL';
ALTER TYPE "ProductSize" ADD VALUE 'XXXXL';
ALTER TYPE "ProductSize" ADD VALUE 'XXXXXL';
ALTER TYPE "ProductSize" ADD VALUE 'XXXXXXL';
ALTER TYPE "ProductSize" ADD VALUE 'XXXXXXXL';
ALTER TYPE "ProductSize" ADD VALUE 'XXXXXXXXL';
