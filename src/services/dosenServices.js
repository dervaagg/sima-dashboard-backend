const { PrismaClient, Prisma } = require("@prisma/client");
const countSemester = require("../utils/countSemester");
const prisma = new PrismaClient();
const fs = require("fs");
const bcrypt = require("bcrypt");
const ResizeFile = require("../utils/resizeFile");
const path = require("path");
const validateSemester = require("../utils/validateSemester");

const getDataRegisterDosen = async (data) => {
    try {
        const result = await prisma.tb_dosen.findUnique({
            where: {
                nip: data.nip,
            },
            select: {
                nama: true,
                fk_pemilik_akun_dosen: {
                    select: {
                        username: true,
                    },
                },
                nip: true,
                foto: true,
            },
        });

        return {
            nama: result.nama,
            username: result.fk_pemilik_akun_dosen.username,
            nip: result.nip,
            foto: result.foto,
        };
    } catch (err) {
        throw err;
    }
};

const updateDataDosen = async (data) => {
    try {
        if (data.oldUsername !== data.username) {
            const checkUsername = await prisma.tb_akun_dosen.findUnique({
                where: {
                    username: data.username,
                },
            });

            if (checkUsername) {
                throw new Error("Username sudah digunakan");
            }
        }

        const kodeProv = data.kodeKab.substring(0, 2);
        const hashedPassword = await bcrypt.hash(data.password, 10);
        let fileName;
        if (data.foto) {
            const imagePath = path.join(__dirname, "../../public/images/foto_dosen/");
            const fileUpload = new ResizeFile(
                imagePath,
                path.extname(data.foto.originalname)
            );
            fileName = await fileUpload.save(data.foto.buffer);
        }

        const [updateAkun, updateDosen] = await prisma.$transaction([
            prisma.tb_akun_dosen.update({
                where: {
                    pemilik: data.nip,
                },
                data: {
                    username: data.username,
                    password: hashedPassword,
                },
            }),
            prisma.tb_dosen.update({
                where: {
                    nip: data.nip,
                },
                data: {
                    email: data.email,
                    alamat: data.alamat,
                    kodeKab: data.kodeKab,
                    kodeProv: kodeProv,
                    noHP: data.noHP,
                    foto: fileName,
                },
            }),
        ]);

        if (!updateAkun || !updateDosen) {
            throw new Error("Terjadi kesalahan, silahkan coba lagi");
        }

        return {
            foto: fileName,
            username: data.username,
        };
    } catch (err) {
        throw err;
    }
};

// TODO: refactor get status validasi
// !!! Forgot to add who hasn't entered the data yet
// Get status validasi
const getStatusValidasiIRS = async (data) => {
    try {
        // NEEDS: add search feature in frontend
        // Filter for search by keyword
        const filterKeyword = data.keyword
            ? {
                OR: [
                    {
                        nama: {
                            contains: data.keyword,
                        },
                    },
                    {
                        nim: {
                            contains: data.keyword,
                        },
                    },
                ],
            }
            : {};

        // Get total amount of data
        let maxPage = await prisma.tb_irs.count({
            where: {
                fk_nim: {
                    kodeWali: data.nip,
                    ...filterKeyword,
                },
            },
        });
        maxPage = Math.ceil(maxPage / data.qty);

        // Revalidate current page
        if (maxPage != 0 && (data.page < 1 || data.page > maxPage))
            throw new Error("Bad request. Page param not valid");

        // Create query
        const query = {
            where: {
                fk_nim: {
                    kodeWali: data.nip,
                    ...filterKeyword,
                },
            },
            include: {
                fk_nim: true,
            },
            orderBy: {},

            take: data.qty,
            skip: (data.page - 1) * data.qty,
        };

        // Add order
        const orderMhs = ["nama", "nim", "angkatan", "statusAktif"];
        const orderIrs = ["semester", "jumlahSks", "statusValidasi"];

        if (orderIrs.includes(data.sortBy)) {
            query.orderBy[data.sortBy] = data.order;
        } else if (orderMhs.includes(data.sortBy)) {
            query.orderBy["fk_nim"] = {};
            query.orderBy.fk_nim[data.sortBy] = data.order;
        } else {
            throw new Error("Order not valid");
        }

        // Get all data irs according to query
        const result = await prisma.tb_irs.findMany(query);

        // Reshape data
        const filledIrs = result.map((d) => {
            const dataMhs = {
                nim: d["fk_nim"].nim,
                nama: d["fk_nim"].nama,
                angkatan: d["fk_nim"].angkatan,
                statusAktif: d["fk_nim"].statusAktif,
            };
            delete d["fk_nim"];

            return {
                ...d,
                ...dataMhs,
            };
        });

        return {
            currentPage: data.page,
            maxPage: maxPage,
            list: filledIrs,
        };
    } catch (err) {
        throw new Error(err);
    }
};

const getStatusValidasiKHS = async (data) => {
    try {
        // NEEDS: add search feature in frontend
        // Filter for search by keyword
        const filterKeyword = data.keyword
            ? {
                OR: [
                    {
                        nama: {
                            contains: data.keyword,
                        },
                    },
                    {
                        nim: {
                            contains: data.keyword,
                        },
                    },
                ],
            }
            : {};

        // Get total amount of data
        let maxPage = await prisma.tb_khs.count({
            where: {
                fk_nim: {
                    kodeWali: data.nip,
                    ...filterKeyword,
                },
            },
        });
        maxPage = Math.ceil(maxPage / data.qty);

        // Revalidate current page
        if (maxPage != 0 && (data.page < 1 || data.page > maxPage))
            throw new Error("Bad request. Page param not valid");

        // Create query
        const query = {
            where: {
                fk_nim: {
                    kodeWali: data.nip,
                    ...filterKeyword,
                },
            },
            include: {
                fk_nim: true,
            },
            orderBy: {},

            take: data.qty,
            skip: (data.page - 1) * data.qty,
        };

        // Add order
        const orderMhs = ["nama", "nim", "angkatan", "statusAktif"];
        const orderKhs = [
            "semester",
            "jumlahSksSemester",
            "ips",
            "jumlahSksKumulatif",
            "ipk",
            "statusValidasi",
        ];

        if (orderKhs.includes(data.sortBy)) {
            query.orderBy[data.sortBy] = data.order;
        } else if (orderMhs.includes(data.sortBy)) {
            query.orderBy["fk_nim"] = {};
            query.orderBy.fk_nim[data.sortBy] = data.order;
        } else {
            throw new Error("Order not valid");
        }

        // Get all data irs according to query
        const result = await prisma.tb_khs.findMany(query);

        // Reshape data
        const filledKhs = result.map((d) => {
            const dataMhs = {
                nim: d["fk_nim"].nim,
                nama: d["fk_nim"].nama,
                angkatan: d["fk_nim"].angkatan,
                statusAktif: d["fk_nim"].statusAktif,
            };
            delete d["fk_nim"];

            return {
                ...d,
                ...dataMhs,
            };
        });

        return {
            currentPage: data.page,
            maxPage: maxPage,
            list: filledKhs,
        };
    } catch (err) {
        throw new Error(err);
    }
};

const getStatusValidasiPKL = async (data) => {
    try {
        // NEEDS: add search feature in frontend
        // Filter for search by keyword
        const filterKeyword = data.keyword
            ? {
                OR: [
                    {
                        nama: {
                            contains: data.keyword,
                        },
                    },
                    {
                        nim: {
                            contains: data.keyword,
                        },
                    },
                ],
            }
            : {};

        // Get total amount of data
        let maxPage = await prisma.tb_pkl.count({
            where: {
                fk_nim: {
                    kodeWali: data.nip,
                    ...filterKeyword,
                },
            },
        });
        maxPage = Math.ceil(maxPage / data.qty);

        // Revalidate current page
        if (maxPage != 0 && (data.page < 1 || data.page > maxPage))
            throw new Error("Bad request. Page param not valid");

        // Create query
        const query = {
            where: {
                fk_nim: {
                    kodeWali: data.nip,
                    ...filterKeyword,
                },
            },
            include: {
                fk_nim: true,
            },
            orderBy: {},

            take: data.qty,
            skip: (data.page - 1) * data.qty,
        };

        // Add order
        const orderMhs = ["nama", "nim", "angkatan", "statusAktif"];
        const orderPkl = ["semester", "nilai", "statusValidasi"];

        if (orderPkl.includes(data.sortBy)) {
            query.orderBy[data.sortBy] = data.order;
        } else if (orderMhs.includes(data.sortBy)) {
            query.orderBy["fk_nim"] = {};
            query.orderBy.fk_nim[data.sortBy] = data.order;
        } else {
            throw new Error("Order not valid");
        }

        // Get all data irs according to query
        const result = await prisma.tb_pkl.findMany(query);

        // Reshape data
        const filledPkl = result.map((d) => {
            const dataMhs = {
                nim: d["fk_nim"].nim,
                nama: d["fk_nim"].nama,
                angkatan: d["fk_nim"].angkatan,
                statusAktif: d["fk_nim"].statusAktif,
            };
            delete d["fk_nim"];

            return {
                ...d,
                ...dataMhs,
            };
        });

        return {
            currentPage: data.page,
            maxPage: maxPage,
            list: filledPkl,
        };
    } catch (err) {
        throw new Error(err);
    }
};

const getStatusValidasiSkripsi = async (data) => {
    try {
        // NEEDS: add search feature in frontend
        // Filter for search by keyword
        const filterKeyword = data.keyword
            ? {
                OR: [
                    {
                        nama: {
                            contains: data.keyword,
                        },
                    },
                    {
                        nim: {
                            contains: data.keyword,
                        },
                    },
                ],
            }
            : {};

        // Get total amount of data
        let maxPage = await prisma.tb_skripsi.count({
            where: {
                fk_nim: {
                    kodeWali: data.nip,
                    ...filterKeyword,
                },
            },
        });
        maxPage = Math.ceil(maxPage / data.qty);

        // Revalidate current page
        if (maxPage != 0 && (data.page < 1 || data.page > maxPage))
            throw new Error("Bad request. Page param not valid");

        // Create query
        const query = {
            where: {
                fk_nim: {
                    kodeWali: data.nip,
                    ...filterKeyword,
                },
            },
            include: {
                fk_nim: true,
            },
            orderBy: {},

            take: data.qty,
            skip: (data.page - 1) * data.qty,
        };

        // Add order
        const orderMhs = ["nama", "nim", "angkatan", "statusAktif"];
        const orderSkripsi = [
            "semester",
            "nilai",
            "tanggalLulusSidang",
            "lamaStudi",
            "statusValidasi",
        ];

        if (orderSkripsi.includes(data.sortBy)) {
            query.orderBy[data.sortBy] = data.order;
        } else if (orderMhs.includes(data.sortBy)) {
            query.orderBy["fk_nim"] = {};
            query.orderBy.fk_nim[data.sortBy] = data.order;
        } else {
            throw new Error("Order not valid");
        }

        // Get all data irs according to query
        const result = await prisma.tb_skripsi.findMany(query);

        // Reshape data
        const filledSkripsi = result.map((d) => {
            const dataMhs = {
                nim: d["fk_nim"].nim,
                nama: d["fk_nim"].nama,
                angkatan: d["fk_nim"].angkatan,
                statusAktif: d["fk_nim"].statusAktif,
            };
            delete d["fk_nim"];

            return {
                ...d,
                ...dataMhs,
            };
        });

        return {
            currentPage: data.page,
            maxPage: maxPage,
            list: filledSkripsi,
        };
    } catch (err) {
        throw new Error(err);
    }
};

// Validasi data mahasiswa
const validasiDataIrs = async (data) => {
    try {
        const fileName = `irs-${data.nim}-${data.semester}.pdf`;
        let oldSemester = data.fileName.split("-")[2]; // For renaming purpose
        oldSemester = oldSemester.substring(0, oldSemester.length - 4);

        // Check if file exists
        if (!fs.existsSync(`public/documents` + data.fileName))
            throw new Error("File doesn't exist, not valid");

        // Basic checking
        if (isNaN(oldSemester)) throw new Error("Filename not valid");

        // Check dosen wali
        const checkDoswal = await prisma.tb_mhs.findFirst({
            where: {
                nim: data.nim,
                kodeWali: data.nip,
            },
        });

        if (!checkDoswal)
            throw new Error("Bukan dosen wali, data mahasiswa tidak dapat diakses");

        // Check semester
        if (!(await validateSemester(data.nim, data.semester))) throw new Error("Semester tidak valid")

        if (data.semester != oldSemester) {
            const checkSemester = await prisma.tb_irs.findUnique({
                where: {
                    nim_semester: {
                        nim: data.nim,
                        semester: data.semester,
                    },
                },
            });

            if (checkSemester) throw new Error("Semester sudah terisi");
        }

        // Update
        const result = await prisma.tb_irs.update({
            where: {
                nim_semester: {
                    nim: data.nim,
                    semester: oldSemester,
                },
            },
            data: {
                semester: data.semester,
                status: data.status,
                jumlahSks: data.jumlahSks,
                fileIrs: fileName,
                statusValidasi: true,
            },
        });

        // Rename document if semester is different
        if (oldSemester !== data.semester) {
            fs.renameSync(
                `public/documents` + data.fileName,
                `public/documents/irs/${fileName}`
            );
        }

        return result;
    } catch (err) {
        throw err;
    }
};

const validasiDataKhs = async (data) => {
    try {
        const fileName = `khs-${data.nim}-${data.semester}.pdf`;
        let oldSemester = data.fileName.split("-")[2]; // For renaming purpose
        oldSemester = oldSemester.substring(0, oldSemester.length - 4);

        // Check if file exists
        if (!fs.existsSync(`public/documents` + data.fileName))
            throw new Error("File doesn't exist, not valid");

        // Basic checking
        if (isNaN(oldSemester)) throw new Error("Filename not valid");

        // Check dosen wali
        const checkDoswal = await prisma.tb_mhs.findFirst({
            where: {
                nim: data.nim,
                kodeWali: data.nip,
            },
        });

        if (!checkDoswal)
            throw new Error("Bukan dosen wali, data mahasiswa tidak dapat diakses");

        // Check semester
        if (!(await validateSemester(data.nim, data.semester))) throw new Error("Semester tidak valid")

        if (data.semester != oldSemester) {
            const checkSemester = await prisma.tb_khs.findUnique({
                where: {
                    nim_semester: {
                        nim: data.nim,
                        semester: data.semester,
                    },
                },
            });
            if (checkSemester) throw new Error("Semester sudah terisi");
        }

        // Update
        const result = await prisma.tb_khs.update({
            where: {
                nim_semester: {
                    nim: data.nim,
                    semester: oldSemester,
                },
            },
            data: {
                semester: data.semester,
                status: data.status,
                jumlahSksSemester: data.jumlahSksSemester,
                ips: data.ips,
                jumlahSksKumulatif: data.jumlahSksKumulatif,
                ipk: data.ipk,
                fileKhs: fileName,
                statusValidasi: true,
            },
        });

        // Rename document if semester is different
        if (oldSemester !== data.semester) {
            fs.renameSync(
                `public/documents` + data.fileName,
                `public/documents/irs/${fileName}`
            );
        }

        return result;
    } catch (err) {
        throw err;
    }
};

const validasiDataPkl = async (data) => {
    try {
        const fileName = `pkl-${data.nim}-${data.semester}.pdf`;
        let oldSemester = data.fileName.split("-")[2]; // For renaming purpose
        oldSemester = oldSemester.substring(0, oldSemester.length - 4);

        // Check if file exists
        if (!fs.existsSync(`public/documents` + data.fileName))
            throw new Error("File doesn't exist, not valid");

        // Basic checking
        if (isNaN(oldSemester)) throw new Error("Filename not valid");

        // Check dosen wali
        const checkDoswal = await prisma.tb_mhs.findFirst({
            where: {
                nim: data.nim,
                kodeWali: data.nip,
            },
        });

        if (!checkDoswal)
            throw new Error("Bukan dosen wali, data mahasiswa tidak dapat diakses");

        // Check semester
        if (!(await validateSemester(data.nim, data.semester)) || data.semester < 6) throw new Error("Semester tidak valid")

        // Update
        const result = await prisma.tb_pkl.update({
            where: {
                nim_semester: {
                    nim: data.nim,
                    semester: oldSemester,
                },
            },
            data: {
                semester: data.semester,
                nilai: data.nilai,
                filePkl: fileName,
                statusValidasi: true,
            },
        });

        // Rename document if semester is different
        if (oldSemester !== data.semester) {
            fs.renameSync(
                `public/documents` + data.fileName,
                `public/documents/pkl/${fileName}`
            );
        }
        return result;
    } catch (err) {
        throw err;
    }
};

const validasiDataSkripsi = async (data) => {
    try {
        const fileName = `skripsi-${data.nim}-${data.semester}.pdf`;
        let oldSemester = data.fileName.split("-")[2]; // For renaming purpose
        oldSemester = oldSemester.substring(0, oldSemester.length - 4);

        // Check if file exists
        if (!fs.existsSync(`public/documents` + data.fileName))
            throw new Error("File doesn't exist, not valid");

        // Basic checking
        if (isNaN(oldSemester)) throw new Error("Filename not valid");

        // Check dosen wali
        const checkDoswal = await prisma.tb_mhs.findFirst({
            where: {
                nim: data.nim,
                kodeWali: data.nip,
            },
        });

        if (!checkDoswal)
            throw new Error("Bukan dosen wali, data mahasiswa tidak dapat diakses");

        // Check semester
        if (!(await validateSemester(data.nim, data.semester)) || data.semester < 6) throw new Error("Semester tidak valid")

        // Update
        const result = await prisma.tb_skripsi.update({
            where: {
                nim_semester: {
                    nim: data.nim,
                    semester: data.semester,
                },
            },
            data: {
                semester: data.semester,
                nilai: data.nilai,
                tanggalLulusSidang: new Date(data.tanggalLulusSidang),
                lamaStudi: data.lamaStudi,
                fileSkripsi: fileName,
                statusValidasi: true,
            },
        });

        // Rename document if semester is different
        if (oldSemester !== data.semester) {
            fs.renameSync(
                `public/documents` + data.fileName,
                `public/documents/skripsi/${fileName}`
            );
        }
        return result;
    } catch (err) {
        throw err;
    }
};

const updateStatusAktifMhs = async (data) => {
    try {
        // Check doswal
        const checkDoswal = await prisma.tb_mhs.findUnique({
            where: {
                nim: data.nim
            },
            select: {
                kodeWali: true
            }
        })

        if (!checkDoswal) throw new Error("Mahasiswa not found")
        if (checkDoswal.kodeWali != data.nip) throw new Error("Bukan dosen wali, tidak dapat mengupdate mahasiswa")

        const result = await prisma.tb_mhs.update({
            where: {
                nim: data.nim
            },
            data: {
                statusAktif: data.statusAktif
            }
        })

        return {
            statusAktif: data.statusAktif
        }
    } catch (err) {
        throw err
    }
}

module.exports = {
    getDataRegisterDosen,
    updateDataDosen,

    getStatusValidasiIRS,
    getStatusValidasiKHS,
    getStatusValidasiPKL,
    getStatusValidasiSkripsi,

    validasiDataIrs,
    validasiDataKhs,
    validasiDataPkl,
    validasiDataSkripsi,

    updateStatusAktifMhs,
};
