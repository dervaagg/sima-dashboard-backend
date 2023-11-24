-- CreateEnum
CREATE TYPE "JalurMasuk" AS ENUM ('SBMPTN', 'SNMPTN', 'Mandiri', 'Lainnya');

-- CreateEnum
CREATE TYPE "StatusMhs" AS ENUM ('Aktif', 'Cuti', 'Lulus', 'Mangkir', 'DO', 'UndurDiri', 'MeninggalDunia');

-- CreateEnum
CREATE TYPE "StatusAktif" AS ENUM ('Aktif', 'Cuti');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Operator', 'Departemen', 'Dosen');

-- CreateEnum
CREATE TYPE "StatusAkun" AS ENUM ('Aktif', 'NonAktif');

-- CreateTable
CREATE TABLE "tb_mhs" (
    "nim" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "statusAktif" "StatusMhs" NOT NULL,
    "alamat" TEXT,
    "email" TEXT,
    "kodeKab" TEXT,
    "kodeProv" TEXT,
    "jalurMasuk" "JalurMasuk" NOT NULL,
    "angkatan" INTEGER NOT NULL,
    "noHP" TEXT,
    "kodeWali" TEXT NOT NULL,
    "foto" TEXT,

    CONSTRAINT "tb_mhs_pkey" PRIMARY KEY ("nim")
);

-- CreateTable
CREATE TABLE "tb_dosen" (
    "nip" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT,
    "email" TEXT,
    "kodeKab" TEXT,
    "kodeProv" TEXT,
    "noHP" TEXT,
    "foto" TEXT,

    CONSTRAINT "tb_dosen_pkey" PRIMARY KEY ("nip")
);

-- CreateTable
CREATE TABLE "tb_irs" (
    "nim" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "status" "StatusAktif" NOT NULL,
    "jumlahSks" TEXT,
    "fileIrs" TEXT,
    "statusValidasi" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_irs_pkey" PRIMARY KEY ("nim","semester")
);

-- CreateTable
CREATE TABLE "tb_khs" (
    "nim" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "status" "StatusAktif" NOT NULL,
    "jumlahSksSemester" TEXT,
    "ips" TEXT,
    "jumlahSksKumulatif" TEXT,
    "ipk" TEXT,
    "fileKhs" TEXT,
    "statusValidasi" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_khs_pkey" PRIMARY KEY ("nim","semester")
);

-- CreateTable
CREATE TABLE "tb_pkl" (
    "nim" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "nilai" TEXT NOT NULL,
    "filePkl" TEXT NOT NULL,
    "statusValidasi" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_pkl_pkey" PRIMARY KEY ("nim","semester")
);

-- CreateTable
CREATE TABLE "tb_skripsi" (
    "nim" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "nilai" TEXT NOT NULL,
    "tanggalLulusSidang" DATE NOT NULL,
    "lamaStudi" INTEGER NOT NULL,
    "fileSkripsi" TEXT NOT NULL,
    "statusValidasi" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_skripsi_pkey" PRIMARY KEY ("nim","semester")
);

-- CreateTable
CREATE TABLE "tb_provinsi" (
    "kodeProv" TEXT NOT NULL,
    "namaProv" TEXT NOT NULL,

    CONSTRAINT "tb_provinsi_pkey" PRIMARY KEY ("kodeProv")
);

-- CreateTable
CREATE TABLE "tb_kabupaten" (
    "kodeKab" TEXT NOT NULL,
    "namaKab" TEXT NOT NULL,
    "kodeProv" TEXT NOT NULL,

    CONSTRAINT "tb_kabupaten_pkey" PRIMARY KEY ("kodeKab")
);

-- CreateTable
CREATE TABLE "tb_akun_mhs" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "StatusAkun" NOT NULL,
    "pemilik" TEXT NOT NULL,

    CONSTRAINT "tb_akun_mhs_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "tb_akun_dosen" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "StatusAkun" NOT NULL,
    "pemilik" TEXT NOT NULL,

    CONSTRAINT "tb_akun_dosen_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "tb_role_akun_dosen" (
    "username" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "tb_role_akun_dosen_pkey" PRIMARY KEY ("username","role")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_mhs_nim_key" ON "tb_mhs"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "tb_dosen_nip_key" ON "tb_dosen"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "tb_provinsi_kodeProv_key" ON "tb_provinsi"("kodeProv");

-- CreateIndex
CREATE UNIQUE INDEX "tb_kabupaten_kodeKab_key" ON "tb_kabupaten"("kodeKab");

-- CreateIndex
CREATE UNIQUE INDEX "tb_akun_mhs_username_key" ON "tb_akun_mhs"("username");

-- CreateIndex
CREATE UNIQUE INDEX "tb_akun_mhs_pemilik_key" ON "tb_akun_mhs"("pemilik");

-- CreateIndex
CREATE UNIQUE INDEX "tb_akun_dosen_username_key" ON "tb_akun_dosen"("username");

-- CreateIndex
CREATE UNIQUE INDEX "tb_akun_dosen_pemilik_key" ON "tb_akun_dosen"("pemilik");

-- AddForeignKey
ALTER TABLE "tb_mhs" ADD CONSTRAINT "tb_mhs_kodeKab_fkey" FOREIGN KEY ("kodeKab") REFERENCES "tb_kabupaten"("kodeKab") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_mhs" ADD CONSTRAINT "tb_mhs_kodeProv_fkey" FOREIGN KEY ("kodeProv") REFERENCES "tb_provinsi"("kodeProv") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_mhs" ADD CONSTRAINT "tb_mhs_kodeWali_fkey" FOREIGN KEY ("kodeWali") REFERENCES "tb_dosen"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_dosen" ADD CONSTRAINT "tb_dosen_kodeKab_fkey" FOREIGN KEY ("kodeKab") REFERENCES "tb_kabupaten"("kodeKab") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_dosen" ADD CONSTRAINT "tb_dosen_kodeProv_fkey" FOREIGN KEY ("kodeProv") REFERENCES "tb_provinsi"("kodeProv") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_irs" ADD CONSTRAINT "tb_irs_nim_fkey" FOREIGN KEY ("nim") REFERENCES "tb_mhs"("nim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_khs" ADD CONSTRAINT "tb_khs_nim_fkey" FOREIGN KEY ("nim") REFERENCES "tb_mhs"("nim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_pkl" ADD CONSTRAINT "tb_pkl_nim_fkey" FOREIGN KEY ("nim") REFERENCES "tb_mhs"("nim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_skripsi" ADD CONSTRAINT "tb_skripsi_nim_fkey" FOREIGN KEY ("nim") REFERENCES "tb_mhs"("nim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_kabupaten" ADD CONSTRAINT "tb_kabupaten_kodeProv_fkey" FOREIGN KEY ("kodeProv") REFERENCES "tb_provinsi"("kodeProv") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_akun_mhs" ADD CONSTRAINT "tb_akun_mhs_pemilik_fkey" FOREIGN KEY ("pemilik") REFERENCES "tb_mhs"("nim") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_akun_dosen" ADD CONSTRAINT "tb_akun_dosen_pemilik_fkey" FOREIGN KEY ("pemilik") REFERENCES "tb_dosen"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_role_akun_dosen" ADD CONSTRAINT "tb_role_akun_dosen_username_fkey" FOREIGN KEY ("username") REFERENCES "tb_akun_dosen"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
