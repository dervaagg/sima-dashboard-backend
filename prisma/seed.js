const { PrismaClient } = require("@prisma/client");
const { dosen } = require("../src/data/dosen.js");
const { provinsi, kabupaten } = require("../src/data/location.js");
const { getRole, convertUsername } = require("../src/utils/dosenUtil");
const { getKodeWaliRandom } = require("../src/utils/mahasiswaUtil");
const prisma = new PrismaClient();

async function main() {
    const createProvinsi = await prisma.tb_provinsi.createMany({
        data: provinsi,
        skipDuplicates: true,
    });

    const createKabupaten = await prisma.tb_kabupaten.createMany({
        data: kabupaten,
        skipDuplicates: true,
    });

    const createDosen = await prisma.tb_dosen.createMany({
        data: dosen,
        skipDuplicates: false,
    });

    const createMhs = await prisma.tb_mhs.createMany({
        data: [
            {
                nim: "24060121140040",
                nama: "Bhaskaroger",
                statusAktif: "Aktif",
                jalurMasuk: "SBMPTN",
                angkatan: 2019,
                kodeWali: "196511071992031001",
            },
            {
                nim: "123456",
                nama: "Dummy",
                statusAktif: "Aktif",
                jalurMasuk: "SNMPTN",
                angkatan: 2018,
                kodeWali: getKodeWaliRandom(),
            },
        ],
        skipDuplicates: true,
    });

    const createAkunMhs = await prisma.tb_akun_mhs.createMany({
        data: [
            {
                username: "mhs1",
                password: "mhs1",
                status: "Aktif",
                pemilik: "24060121140040",
            },
            {
                username: "mhs2",
                password: "mhs2",
                status: "Aktif",
                pemilik: "123456",
            },
        ],
        skipDuplicates: true,
    });

    const createAkunDosen = await prisma.tb_akun_dosen.createMany({
        data: dosen.map((dosen) => ({
            username: convertUsername(dosen.nama),
            password: convertUsername(dosen.nama),
            status: "Aktif",
            pemilik: dosen.nip,
        })),
        skipDuplicates: true,
    });

    const createRoleAkunDosen = await prisma.tb_role_akun_dosen.createMany({
        data: dosen.map((dosen) => ({
            username: convertUsername(dosen.nama),
            role: getRole(dosen.nama),
        })),
        skipDuplicates: true,
    });

    const createRoleAkunDepartemen = await prisma.tb_role_akun_dosen.createMany({
        data: [
            { username: "arispuji", role: "Departemen" },
            { username: "adiwibowo", role: "Departemen" },
        ],
        skipDuplicates: true,
    });

    // TODO: ubah status IRS jadi enum
    const createIRS = await prisma.tb_irs.createMany({
        data: [
            {
                nim: "24060121140040",
                semester: "1",
                status: "Aktif",
                jumlahSks: "18",
                fileIrs: "irs1.pdf",
            },
            {
                nim: "24060121140040",
                semester: "2",
                status: "Aktif",
                jumlahSks: "23",
                fileIrs: "irs2.pdf",
            },
            {
                // Edge case - Kasus cuti
                nim: "24060121140040",
                semester: "3",
                status: "Cuti",
                jumlahSks: "0",
                fileIrs: "",
            },
            {
                nim: "24060121140040",
                semester: "4",
                status: "Aktif",
                jumlahSks: "21",
                fileIrs: "irs4.pdf",
            },
            {
                nim: "24060121140040",
                semester: "5",
                status: "Aktif",
                jumlahSks: "21",
                fileIrs: "irs5.pdf",
            },
            {
                nim: "24060121140040",
                semester: "6",
                status: "Aktif",
                jumlahSks: "21",
                fileIrs: "irs6.pdf",
            },
            {
                nim: "24060121140040",
                semester: "7",
                status: "Aktif",
                jumlahSks: "21",
                fileIrs: "irs7.pdf",
            },
        ],
        skipDuplicates: true,
    });

    const createKHS = await prisma.tb_khs.createMany({
        data: [
            {
                nim: "24060121140040",
                semester: "1",
                status: "Aktif",
                jumlahSksSemester: "18",
                ips: "3.00",
                jumlahSksKumulatif: "18",
                ipk: "3.00",
                fileKhs: "khs1.pdf",
            },
            {
                // Example of wrong data, needs validation
                nim: "24060121140040",
                semester: "2",
                status: "Aktif",
                jumlahSksSemester: "25",
                ips: "3.00",
                jumlahSksKumulatif: "43",
                ipk: "3.00",
                fileKhs: "khs2.pdf",
            },
            {
                // Edge case
                nim: "24060121140040",
                semester: "3",
                status: "Cuti",
                jumlahSksSemester: "0",
                ips: "0.00",
                jumlahSksKumulatif: "43",
                ipk: "3.00",
                fileKhs: "",
            },
            {
                nim: "24060121140040",
                semester: "4",
                status: "Aktif",
                jumlahSksSemester: "21",
                ips: "3.00",
                jumlahSksKumulatif: "64",
                ipk: "3.00",
                fileKhs: "khs4.pdf",
            },
            {
                nim: "24060121140040",
                semester: "5",
                status: "Aktif",
                jumlahSksSemester: "21",
                ips: "0.00",
                jumlahSksKumulatif: "85",
                ipk: "3.00",
                fileKhs: "khs5.pdf",
            },
            {
                nim: "24060121140040",
                semester: "6",
                status: "Aktif",
                jumlahSksSemester: "0",
                ips: "0.00",
                jumlahSksKumulatif: "106",
                ipk: "3.00",
                fileKhs: "khs6.pdf",
            },
            {
                nim: "24060121140040",
                semester: "7",
                status: "Aktif",
                jumlahSksSemester: "0",
                ips: "0.00",
                jumlahSksKumulatif: "127",
                ipk: "3.00",
                fileKhs: "khs7.pdf",
            },
        ],
        skipDuplicates: true,
    });

    const createPKL = await prisma.tb_pkl.createMany({
        data: [
            {
                nim: "24060121140040",
                semester: "6",
                nilai: "90",
                filePkl: "pkl.pdf",
            },
        ],
        skipDuplicates: true,
    });

    const createSkripsi = await prisma.tb_skripsi.createMany({
        data: [
            {
                // Edge case
                nim: "24060121140040",
                semester: "7",
                nilai: "",
                tanggalLulusSidang: new Date(),
                lamaStudi: 0, // Harusnya jangan int
                fileSkripsi: "",
            },
        ],
        skipDuplicates: true,
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
