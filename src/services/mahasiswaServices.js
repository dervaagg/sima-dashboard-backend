const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const ResizeFile = require("../utils/resizeFile");
const path = require("path");
const fs = require("fs");
const { getDataAkademikMhs } = require("./dataMahasiswaServices");
const countSemester = require("../utils/countSemester");
const validateSemester = require("../utils/validateSemester");

const getDashboardMahasiswa = async (data) => {
    const result = await getDataAkademikMhs(data);

    // get last khs and statusValidasi == true
    const khs = await prisma.tb_khs.findFirst({
        where: {
            nim: data.nim,
            statusValidasi: true,
        },
        orderBy: {
            semester: "desc",
        },
    });

    return {
        ipkNow: khs !== null ? khs.ipk : 0,
        sksNow: khs !== null ? khs.jumlahSksKumulatif : 0,
        ...result,
    };
};

const getDataRegisterMahasiswa = async (data) => {
    try {
        const result = await prisma.tb_mhs.findUnique({
            where: {
                nim: data.nim,
            },
            select: {
                nama: true,
                nim: true,
                statusAktif: true,
                jalurMasuk: true,
                angkatan: true,
                fk_kodeWali: {
                    select: {
                        nama: true,
                    },
                },
                fk_pemilik_akun_mhs: {
                    select: {
                        // username: true,
                        password: true,
                    },
                },
            },
        });

        return {
            nama: result.nama,
            nim: result.nim,
            angkatan: result.angkatan,
            statusAktif: result.statusAktif,
            jalurMasuk: result.jalurMasuk,
            namaWali: result.fk_kodeWali.nama,
            // username: result.fk_pemilik_akun_mhs.username,
            password: result.fk_pemilik_akun_mhs.password,
        };
    } catch (err) {
        throw err;
    }
};

// TODO : filename foto belum dikirim diresponse
const updateDataMahasiswa = async (data) => {
    try {
        // if (data.oldUsername !== data.username) {
        //     const checkUsername = await prisma.tb_akun_mhs.findUnique({
        //         where: {
        //             username: data.username,
        //         },
        //     });

        //     if (checkUsername) {
        //         throw new Error("Username sudah digunakan");
        //     }
        // }

        const kodeProv = data.kodeKab.substring(0, 2);
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const imagePath = path.join(__dirname, "../../public/images/foto_mhs/");
        const fileUpload = new ResizeFile(
            imagePath,
            path.extname(data.foto.originalname)
        );
        const fileName = await fileUpload.save(data.foto.buffer);

        const [updateAkun, updateMahasiswa] = await prisma.$transaction([
            prisma.tb_akun_mhs.update({
                where: {
                    pemilik: data.nim,
                },
                data: {
                    // username: data.username,
                    password: hashedPassword,
                },
            }),
            prisma.tb_mhs.update({
                where: {
                    nim: data.nim,
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

        if (!updateAkun || !updateMahasiswa) {
            throw new Error("Terjadi kesalahan, silahkan coba lagi");
        }

        return {
            foto: fileName,
            // username: data.username,
        };
    } catch (err) {
        throw err;
    }
};

const entryDataIrs = async (data) => {
    try {
        const statusMhs = await prisma.tb_mhs.findUnique({
            where: {
                nim: data.nim
            }
        })

        if (!["Aktif", "Cuti", "Mangkir", "Lulus"].includes(statusMhs)) throw new Error("Status mahasiswa tidak valid")

        let fileName = "";
        if (data.dokumen) {
            fileName = `irs-${data.nim}-${data.semester}.pdf`;
            fs.renameSync(
                `public/documents/${data.dokumen.originalname}`,
                `public/documents/irs/${fileName}`
            );
        }

        const exist = await prisma.tb_irs.findUnique({
            where: {
                nim_semester: {
                    nim: data.nim,
                    semester: data.semester,
                },
            },
        });

        if (exist && data.oldSemester !== data.semester) {
            if (data.dokumen) {
                fs.unlink(`public/documents/irs/${fileName}`, (err) => {
                    if (err) throw err;
                });
            }
            throw new Error(`IRS semester ${data.semester} telah diisi`);
        }

        // Check if semester is valid
        // TODO: Validate semester masih error
        if (!data.oldSemester) {
            if (await validateSemester(data.nim, data.semester)) {
                let lastIrs = await prisma.tb_irs.aggregate({
                    where: {
                        nim: data.nim,
                    },
                    _max: {
                        semester: true,
                    },
                });
                if (lastIrs._max.semester == null) {
                    if (data.semester != 1) {
                        if (data.dokumen) {
                            fs.unlink(`public/documents/irs/${fileName}`, (err) => {
                                if (err) throw err;
                            });
                        }
                        throw new Error(`IRS harus diisi urut mulai dari semester 1`);
                    }
                } else if (
                    parseInt(data.semester) >
                    parseInt(lastIrs._max.semester) + 1
                ) {
                    if (data.dokumen) {
                        fs.unlink(`public/documents/irs/${fileName}`, (err) => {
                            if (err) throw err;
                        });
                    }
                    throw new Error(
                        `IRS harus diisi urut semester (IRS terakhir yang diisi: semester ${lastIrs._max.semester})`
                    );
                }
            } else {
                if (data.dokumen) {
                    fs.unlink(`public/documents/irs/${fileName}`, (err) => {
                        if (err) throw err;
                    });
                }
                throw new Error(`Semester tidak valid`);
            }
        }

        // Input IRS
        if (data.oldSemester) {
            const updateIrs = await prisma.tb_irs.update({
                where: {
                    nim_semester: {
                        nim: data.nim,
                        semester: data.oldSemester,
                    },
                },
                data: data.dokumen
                    ? {
                        semester: data.semester,
                        fileIrs: fileName,
                        jumlahSks: data.jumlahSks,
                        status: data.status,
                    }
                    : {
                        semester: data.semester,
                        jumlahSks: data.jumlahSks,
                        status: data.status,
                    },
            });

            if (!updateIrs) {
                throw new Error("Terjadi kesalahan, silahkan coba lagi");
            }

            return updateIrs;
        } else {
            const result = await prisma.tb_irs.create({
                data: {
                    nim: data.nim,
                    semester: data.semester,
                    status: data.status,
                    jumlahSks: data.jumlahSks,
                    fileIrs: fileName,
                },
            });

            return result;
        }
    } catch (err) {
        throw err;
    }
};

const entryDataKhs = async (data) => {
    try {
        const statusMhs = await prisma.tb_mhs.findUnique({
            where: {
                nim: data.nim
            }
        })

        if (!["Aktif", "Cuti", "Mangkir", "Lulus"].includes(statusMhs)) throw new Error("Status mahasiswa tidak valid")

        let fileName = "";
        if (data.dokumen) {
            fileName = `khs-${data.nim}-${data.semester}.pdf`;
            fs.renameSync(
                `public/documents/${data.dokumen.originalname}`,
                `public/documents/khs/${fileName}`
            );
        }

        // Check IRS
        const irsExist = await prisma.tb_irs.findUnique({
            where: {
                nim_semester: {
                    nim: data.nim,
                    semester: data.semester,
                },
            },
        });

        if (!irsExist) {
            fs.unlink(`public/documents/khs/${fileName}`, (err) => {
                if (err) throw err;
            });
            throw new Error(
                `IRS semester ${data.semester} harus diisi terlebih dahulu`
            );
        }

        // Check if KHS already exists
        const exist = await prisma.tb_khs.findUnique({
            where: {
                nim_semester: {
                    nim: data.nim,
                    semester: data.semester,
                },
            },
        });

        if (exist && data.oldSemester !== data.semester) {
            if (data.dokumen) {
                fs.unlink(`public/documents/khs/${fileName}`, (err) => {
                    if (err) throw err;
                });
            }
            throw new Error(`KHS semester ${data.semester} telah diisi`);
        }

        // Check if semester is valid
        // let valid = false
        if (!data.oldSemester) {
            if (await validateSemester(data.nim, data.semester)) {
                // Check if KHS is valid filled
                const lastKhs = await prisma.tb_khs.aggregate({
                    where: {
                        nim: data.nim,
                    },
                    _max: {
                        semester: true,
                    },
                });

                if (lastKhs._max.semester == null) {
                    if (data.semester != 1) {
                        fs.unlink(`public/documents/khs/${fileName}`, (err) => {
                            if (err) throw err;
                        });
                        throw new Error(`KHS harus diisi urut mulai dari semester 1`);
                    }
                } else if (
                    parseInt(data.semester) >
                    parseInt(lastKhs._max.semester) + 1
                ) {
                    fs.unlink(`public/documents/khs/${fileName}`, (err) => {
                        if (err) throw err;
                    });
                    throw new Error(
                        `KHS harus diisi urut semester (KHS terakhir yang diisi: semester ${lastKhs._max.semester})`
                    );
                }
            } else {
                fs.unlink(`public/documents/khs/${fileName}`, (err) => {
                    if (err) throw err;
                });
                throw new Error(`Semester tidak valid`);
            }
        }

        // INPUT
        if (data.oldSemester) {
            const updateKhs = await prisma.tb_khs.update({
                where: {
                    nim_semester: {
                        nim: data.nim,
                        semester: data.oldSemester,
                    },
                },
                data: data.dokumen
                    ? {
                        semester: data.semester,
                        status: data.status,
                        jumlahSksSemester: data.jumlahSksSemester,
                        ips: data.ips,
                        jumlahSksKumulatif: data.jumlahSksKumulatif,
                        ipk: data.ipk,
                        fileKhs: fileName,
                    }
                    : {
                        semester: data.semester,
                        status: data.status,
                        jumlahSksSemester: data.jumlahSksSemester,
                        ips: data.ips,
                        jumlahSksKumulatif: data.jumlahSksKumulatif,
                        ipk: data.ipk,
                    },
            });

            if (!updateKhs) {
                throw new Error("Terjadi kesalahan, silahkan coba lagi");
            }

            return updateKhs;
        } else {
            const result = await prisma.tb_khs.create({
                data: {
                    nim: data.nim,
                    semester: data.semester,
                    status: data.status,
                    jumlahSksSemester: data.jumlahSksSemester,
                    ips: data.ips,
                    jumlahSksKumulatif: data.jumlahSksKumulatif,
                    ipk: data.ipk,
                    fileKhs: fileName,
                },
            });

            return result;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};

const entryDataPkl = async (data) => {
    try {
        const statusMhs = await prisma.tb_mhs.findUnique({
            where: {
                nim: data.nim
            }
        })

        if (!["Aktif", "Cuti", "Mangkir", "Lulus"].includes(statusMhs)) throw new Error("Status mahasiswa tidak valid")

        let fileName = "";
        if (data.dokumen) {
            fileName = `pkl-${data.nim}-${data.semester}.pdf`;
            fs.renameSync(
                `public/documents/${data.dokumen.originalname}`,
                `public/documents/pkl/${fileName}`
            );
        }

        // PKL can only be filled once
        const findPkl = await prisma.tb_pkl.findFirst({
            where: {
                nim: data.nim
            },
        });

        if (findPkl && data.oldSemester !== data.semester)
            throw new Error("Data PKL telah terisi");

        // let valid = false
        if (!data.oldSemester) {
            if (await validateSemester(data.nim, data.semester)) {
                // Check if IRS is already filled
                const lastIrs = await prisma.tb_irs.findUnique({
                    where: {
                        nim_semester: {
                            nim: data.nim,
                            semester: data.semester,
                        },
                    },
                });

                if (!lastIrs) {
                    fs.unlink(`public/documents/pkl/${fileName}`, (err) => {
                        if (err) throw err;
                    });
                    throw new Error(
                        `IRS semester ${data.semester} harus diisi terlebih dahulu`
                    );
                }
            } else {
                fs.unlink(`public/documents/pkl/${fileName}`, (err) => {
                    if (err) throw err;
                });
                throw new Error(`Semester tidak valid`);
            }
        }

        if (data.oldSemester) {
            const updatePkl = await prisma.tb_pkl.update({
                where: {
                    nim_semester: {
                        nim: data.nim,
                        semester: data.oldSemester,
                    },
                },
                data: data.dokumen
                    ? {
                        semester: data.semester,
                        nilai: data.nilai,
                        filePkl: fileName,
                    }
                    : {
                        semester: data.semester,
                        nilai: data.nilai,
                    },
            });

            if (!updatePkl) {
                throw new Error("Terjadi kesalahan, silahkan coba lagi");
            }

            return updatePkl;
        } else {
            const result = await prisma.tb_pkl.create({
                data: {
                    nim: data.nim,
                    semester: data.semester,
                    status: data.status,
                    nilai: data.nilai,
                    filePkl: fileName,
                },
            });

            return result;
        }
    } catch (err) {
        throw err;
    }
};

const entryDataSkripsi = async (data) => {
    try {
        const statusMhs = await prisma.tb_mhs.findUnique({
            where: {
                nim: data.nim
            }
        })

        if (!["Aktif", "Cuti", "Mangkir", "Lulus"].includes(statusMhs)) throw new Error("Status mahasiswa tidak valid")

        let fileName = "";
        if (data.dokumen) {
            fileName = `skripsi-${data.nim}-${data.semester}.pdf`;
            fs.renameSync(
                `public/documents/${data.dokumen.originalname}`,
                `public/documents/skripsi/${fileName}`
            );
        }

        // Skripsi can only be filled once
        const findSkripsi = await prisma.tb_skripsi.findFirst({
            where: {
                nim: data.nim,
            },
        });

        if (findSkripsi && data.oldSemester !== data.semester)
            throw new Error("Data Skripsi telah terisi");

        if (await validateSemester(data.nim, data.semester)) {
            // Check if IRS is already filled
            const lastIrs = await prisma.tb_irs.findUnique({
                where: {
                    nim_semester: {
                        nim: data.nim,
                        semester: data.semester,
                    },
                },
            });

            if (!lastIrs) {
                fs.unlink(`public/documents/skripsi/${fileName}`, (err) => {
                    if (err) throw err;
                });
                throw new Error(
                    `IRS semester ${data.semester} harus diisi terlebih dahulu`
                );
            }
        } else {
            fs.unlink(`public/documents/skripsi/${fileName}`, (err) => {
                if (err) throw err;
            });
            throw new Error(`Semester tidak valid`);
        }

        if (data.oldSemester) {
            const updateSkripsi = await prisma.tb_skripsi.update({
                where: {
                    nim_semester: {
                        nim: data.nim,
                        semester: data.oldSemester,
                    },
                },
                data: data.dokumen
                    ? {
                        semester: data.semester,
                        status: data.status,
                        nilai: data.nilai,
                        tanggalLulusSidang: new Date(data.tanggalLulusSidang),
                        fileSkripsi: fileName,
                        lamaStudi: parseInt(data.lamaStudi),
                    }
                    : {
                        semester: data.semester,
                        status: data.status,
                        nilai: data.nilai,
                        tanggalLulusSidang: new Date(data.tanggalLulusSidang),
                        lamaStudi: parseInt(data.lamaStudi),
                    },
            });
        } else {
            const result = await prisma.tb_skripsi.create({
                data: {
                    nim: data.nim,
                    semester: data.semester,
                    status: data.status,
                    nilai: data.nilai,
                    tanggalLulusSidang: new Date(data.tanggalLulusSidang),
                    fileSkripsi: fileName,
                    lamaStudi: parseInt(data.lamaStudi),
                },
            });
            return result;
        }
    } catch (err) {
        throw err;
    }
};

const getProfileMahasiswa = async (data) => {
    try {
        const result = await prisma.tb_mhs.findUnique({
            where: {
                nim: data.nim,
            },
            select: {
                angkatan: true,
                statusAktif: true,
                jalurMasuk: true,
                email: true,
                noHP: true,
                fk_kodeWali: {
                    select: {
                        nama: true,
                        nip: true
                    }
                },
                fk_nim_khs: {
                    orderBy: {
                        semester: "desc",
                    },
                    take: 1,
                    select: {
                        ipk: true,
                        jumlahSksKumulatif: true,
                    },
                },
                fk_kodeKab: {
                    select: {
                        namaKab: true,
                    },
                },
                fk_kodeProv: {
                    select: {
                        namaProv: true,
                    },
                },
                alamat: true
            },
        });

        // spread profile mahasiswa
        const profile = {
            angkatan: result.angkatan,
            namaDosenWali: result.fk_kodeWali.nama,
            nipDosenWali: result.fk_kodeWali.nip,
            semester: countSemester(result.angkatan),
            status: result.statusAktif,
            jalurMasuk: result.jalurMasuk,
            email: result.email,
            noHP: result.noHP,
            // alamat: result.alamat,
            // namaKab: result.fk_kodeKab.namaKab,
            // namaProv: result.fk_kodeProv.namaProv,
            ipk: result.fk_nim_khs.length > 0 ? result.fk_nim_khs[0].ipk : "-",
            jumlahSksKumulatif:
                result.fk_nim_khs.length > 0
                    ? result.fk_nim_khs[0].jumlahSksKumulatif
                    : "-",
        };

        return profile;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    getDataRegisterMahasiswa,
    updateDataMahasiswa,

    getDashboardMahasiswa,
    entryDataIrs,
    entryDataKhs,
    entryDataPkl,
    entryDataSkripsi,
    getProfileMahasiswa,
};
