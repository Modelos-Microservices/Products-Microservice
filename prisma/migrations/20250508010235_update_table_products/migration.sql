-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "description" TEXT,
ADD COLUMN     "discountPercentage" DOUBLE PRECISION DEFAULT 0.0,
ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT 'https://media.istockphoto.com/id/1414159406/es/vector/multicolor-abstracto-rojo-naranja-verde-p%C3%BArpura-amarillo-colorido-ondulado-papelcut.jpg?s=612x612&w=0&k=20&c=UNjQErYytEZGkh72OyyN0XvryBi_G7_NUmQGwmK34jg=',
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 1;
