const { PrismaClient } = require("@prisma/client");
const e = require("express");
const xlsx = require("xlsx");
const prisma = new PrismaClient();

const rekapStatusMahasiswa = async (data) => {
    try {
        const filterWali = data
            ? {
                kodeWali: data.nip,
            }
            : {};
        const result = await prisma.tb_mhs.groupBy({
            by: ["angkatan", "statusAktif"],
            where: {
                ...filterWali,
            },
            _count: {
                nim: true,
            },
        });

        const filterByAngkatan = result.reduce((acc, cur) => {
            const { angkatan, statusAktif, _count } = cur;
            const { nim } = _count;

            if (acc[angkatan]) {
                acc[angkatan][statusAktif] = nim;
            } else {
                acc[angkatan] = {
                    Aktif: 0,
                    Cuti: 0,
                    Mangkir: 0,
                    DO: 0,
                    UndurDiri: 0,
                    Lulus: 0,
                    MeninggalDunia: 0,
                };
                acc[angkatan][statusAktif] = nim;
            }

            return acc;
        }, {});

        const rekapStatus = Object.keys(filterByAngkatan).map((item) => {
            return {
                angkatan: item,
                aktif: filterByAngkatan[item].Aktif,
                cuti: filterByAngkatan[item].Cuti,
                mangkir: filterByAngkatan[item].Mangkir,
                dropout: filterByAngkatan[item].DO,
                undurDiri: filterByAngkatan[item].UndurDiri,
                lulus: filterByAngkatan[item].Lulus,
                meninggalDunia: filterByAngkatan[item].MeninggalDunia,
            };
        });

        return rekapStatus;
    } catch (error) {
        throw error;
    }
};

const daftarStatusMahasiswa = async (data) => {
    try {
        const filterWali = data.nip
            ? {
                kodeWali: data.nip,
            }
            : {};

        // Sort by mahasiswa data
        let sortFilter = {};
        const orderMhs = ["nama", "nim", "angkatan", "statusAktif"];
        const orderKhs = ["ipk", "jumlahSksKumulatif"];
        if (!data.sortBy) {
            sortFilter = [
                {
                    angkatan: "asc",
                },
                {
                    nim: "asc",
                },
            ];
        } else if (orderMhs.includes(data.sortBy)) {
            sortFilter[data.sortBy] = data.order;
        } else if (!orderKhs.includes(data.sortBy)) {
            throw new Error("Bad Request: Sort params not valid");
        }

        // Get total amount of data
        let maxPage = await prisma.tb_mhs.count({
            where: {
                ...filterWali,
            },
        });
        maxPage = Math.ceil(maxPage / data.qty);

        // Revalidate current page
        if (data.page < 1 || data.page > maxPage)
            throw new Error("Bad request. Params not valid");

        const result = await prisma.tb_mhs.findMany({
            where: {
                ...filterWali,
            },
            select: {
                nim: true,
                nama: true,
                angkatan: true,
                statusAktif: true,
                fk_nim_khs: {
                    orderBy: {
                        semester: "desc",
                    },
                    take: 1,
                    select: {
                        jumlahSksKumulatif: true,
                        ipk: true,
                    },
                },
            },
            take: data.qty,
            skip: (data.page - 1) * data.qty,
            orderBy: sortFilter,
        });

        // spread fk_nim_khs
        result.map((item) => {
            const { fk_nim_khs } = item;
            const khs = fk_nim_khs;
            if (khs.length > 0) {
                const { jumlahSksKumulatif, ipk } = khs[0];
                item.jumlahSksKumulatif = jumlahSksKumulatif;
                item.ipk = ipk;
            } else {
                item.jumlahSksKumulatif = 0;
                item.ipk = 0;
            }
            delete item.fk_nim_khs;
        });

        // Sort by khs data (ipk or sksk)
        if (orderKhs.includes(data.sortBy)) {
            result.sort((a, b) => {
                if (data.order === "asc") {
                    return parseFloat(a[data.sortBy]) - parseFloat(b[data.sortBy]);
                } else {
                    return parseFloat(b[data.sortBy]) - parseFloat(a[data.sortBy]);
                }
            });
        }

        return {
            currentPage: data.page,
            maxPage: maxPage,
            list: result,
        };
    } catch (error) {
        throw error;
    }
};

const rekapPklMahasiswa = async (data) => {
    // !!! FILTER WALI ??
    try {
        const result = await prisma.tb_mhs.findMany({
            select: {
                nim: true,
                kodeWali: true,
                fk_nim_pkl: true,
                angkatan: true,
            },
        });

        let pkl = result;
        if (data) {
            pkl = result.filter((item) => item.kodeWali === data.nip);
        }

        const filterByAngkatan = pkl.reduce((acc, cur) => {
            const { angkatan, fk_nim_pkl } = cur;
            const pkl = fk_nim_pkl;
            if (acc[angkatan]) {
                if (pkl.length > 0 && pkl[0].statusValidasi === true) {
                    acc[angkatan].lulus += 1;
                } else {
                    acc[angkatan].belum += 1;
                }
            } else {
                if (pkl.length > 0 && pkl[0].statusValidasi === true) {
                    acc[angkatan] = {
                        lulus: 1,
                        belum: 0,
                    };
                } else {
                    acc[angkatan] = {
                        lulus: 0,
                        belum: 1,
                    };
                }
            }
            return acc;
        }, {});

        const rekapPkl = Object.keys(filterByAngkatan).map((item) => {
            return {
                angkatan: item,
                lulus: filterByAngkatan[item].lulus,
                belum: filterByAngkatan[item].belum,
            };
        });

        return rekapPkl;
    } catch (error) {
        throw error;
    }
};

const daftarPklMahasiswa = async (data) => {
    try {
        const filterWali = data.nip
            ? {
                kodeWali: data.nip,
            }
            : {};

        // Sort by mahasiswa data
        let sortFilter = {};
        const orderMhs = ["nama", "nim", "angkatan"];
        const orderPkl = ["semester", "nilai"];
        if (!data.sortBy) {
            sortFilter = [
                {
                    angkatan: "asc",
                },
                {
                    nim: "asc",
                },
            ];
        } else if (orderMhs.includes(data.sortBy)) {
            sortFilter[data.sortBy] = data.order;
        } else if (!orderPkl.includes(data.sortBy)) {
            throw new Error("Bad Request: Sort params not valid");
        }

        // Get total amount of data
        let maxPage = await prisma.tb_mhs.count({
            where: {
                ...filterWali,
            },
        });
        maxPage = Math.ceil(maxPage / data.qty);

        // Revalidate current page
        if (data.page < 1 || data.page > maxPage)
            throw new Error("Bad request. Params not valid");

        const result = await prisma.tb_mhs.findMany({
            where: {
                ...filterWali,
            },
            select: {
                nim: true,
                nama: true,
                angkatan: true,
                fk_nim_pkl: {
                    select: {
                        nilai: true,
                        semester: true,
                        statusValidasi: true,
                    },
                },
            },
            take: data.qty,
            skip: (data.page - 1) * data.qty,
            orderBy: sortFilter,
        });

        // change status pkl
        result.map((item) => {
            const { fk_nim_pkl } = item;
            if (fk_nim_pkl.length > 0 && fk_nim_pkl[0].statusValidasi === true) {
                item.nilai = fk_nim_pkl[0].nilai;
                item.semester = fk_nim_pkl[0].semester;
            } else {
                item.nilai = "-";
                item.semester = "-";
            }
            delete item.fk_nim_pkl;
        });

        // Sort by pkl data (nilaiPkl)
        if (orderPkl.includes(data.sortBy)) {
            result.sort((a, b) => {
                if (data.order === "asc") {
                    return parseFloat(a[data.sortBy]) - parseFloat(b[data.sortBy]);
                } else {
                    return parseFloat(b[data.sortBy]) - parseFloat(a[data.sortBy]);
                }
            });
        }

        return {
            currentPage: data.page,
            maxPage: maxPage,
            list: result,
        };
    } catch (error) {
        throw error;
    }
};

const rekapSkripsiMahasiswa = async (data) => {
    // !!! FILTER WALI ??
    try {
        const result = await prisma.tb_mhs.findMany({
            select: {
                nim: true,
                kodeWali: true,
                fk_nim_skripsi: true,
                angkatan: true,
            },
        });
        let skripsi = result;
        if (data) {
            skripsi = result.filter((item) => item.kodeWali === data.nip);
        }

        const filterByAngkatan = skripsi.reduce((acc, cur) => {
            const { angkatan, fk_nim_skripsi } = cur;
            const skripsi = fk_nim_skripsi;
            if (acc[angkatan]) {
                if (skripsi.length > 0 && skripsi[0].statusValidasi === true) {
                    acc[angkatan].lulus += 1;
                } else {
                    acc[angkatan].belum += 1;
                }
            } else {
                if (skripsi.length > 0 && skripsi[0].statusValidasi === true) {
                    acc[angkatan] = {
                        lulus: 1,
                        belum: 0,
                    };
                } else {
                    acc[angkatan] = {
                        lulus: 0,
                        belum: 1,
                    };
                }
            }

            return acc;
        }, {});

        const rekapSkripsi = Object.keys(filterByAngkatan).map((item) => {
            return {
                angkatan: item,
                lulus: filterByAngkatan[item].lulus,
                belum: filterByAngkatan[item].belum,
            };
        });

        return rekapSkripsi;
    } catch (error) {
        throw error;
    }
};

const daftarSkripsiMahasiswa = async (data) => {
    try {
        const filterWali = data.nip
            ? {
                kodeWali: data.nip,
            }
            : {};

        // Sort by mahasiswa data
        let sortFilter = {};
        const orderMhs = ["nama", "nim", "angkatan"];
        const orderSkripsi = ["nilai", "tanggalLulusSidang", "lamaStudi"];
        if (!data.sortBy) {
            sortFilter = [
                {
                    angkatan: "asc",
                },
                {
                    nim: "asc",
                },
            ];
        } else if (orderMhs.includes(data.sortBy)) {
            sortFilter[data.sortBy] = data.order;
        } else if (!orderSkripsi.includes(data.sortBy)) {
            throw new Error("Bad Request: Sort params not valid");
        }

        // Get total amount of data
        let maxPage = await prisma.tb_mhs.count({
            where: {
                ...filterWali,
            },
        });
        maxPage = Math.ceil(maxPage / data.qty);

        // Revalidate current page
        if (data.page < 1 || data.page > maxPage)
            throw new Error("Bad request. Params not valid");

        const result = await prisma.tb_mhs.findMany({
            where: {
                ...filterWali,
            },
            select: {
                nim: true,
                nama: true,
                angkatan: true,
                fk_nim_skripsi: {
                    select: {
                        nilai: true,
                        statusValidasi: true,
                        tanggalLulusSidang: true,
                        lamaStudi: true,
                        semester: true,
                    },
                },
            },
            take: data.qty,
            skip: (data.page - 1) * data.qty,
            orderBy: sortFilter,
        });

        // change status skripsi
        result.map((item) => {
            const { fk_nim_skripsi } = item;
            if (
                fk_nim_skripsi.length > 0 &&
                fk_nim_skripsi[0].statusValidasi === true
            ) {
                item.nilai = fk_nim_skripsi[0].nilai;
                item.tanggalLulusSidang = fk_nim_skripsi[0].tanggalLulusSidang;
                item.lamaStudi = fk_nim_skripsi[0].lamaStudi;
                item.semester = fk_nim_skripsi[0].semester;
            } else {
                item.nilai = "-";
                item.tanggalLulusSidang = "-";
                item.lamaStudi = "-";
                item.semester = "-";
            }
            delete item.fk_nim_skripsi;
        });

        // Sort by khs data (ipk or sksk)
        if (orderSkripsi.includes(data.sortBy)) {
            result.sort((a, b) => {
                if (data.order === "asc") {
                    return parseFloat(a[data.sortBy]) - parseFloat(b[data.sortBy]);
                } else {
                    return parseFloat(b[data.sortBy]) - parseFloat(a[data.sortBy]);
                }
            });
        }

        return {
            currentPage: data.page,
            maxPage: maxPage,
            list: result,
        };
    } catch (error) {
        throw error;
    }
};

const cetakDaftarStatusMahasiswa = async (data) => {
    try {
        const filterWali = data.nip
            ? {
                kodeWali: data.nip,
            }
            : {};

        const result = await prisma.tb_mhs.findMany({
            where: {
                ...filterWali,
            },
            select: {
                nim: true,
                nama: true,
                angkatan: true,
                statusAktif: true,
                fk_nim_khs: {
                    orderBy: {
                        semester: "desc",
                    },
                    take: 1,
                    select: {
                        jumlahSksKumulatif: true,
                        ipk: true,
                    },
                },
            },
        });

        // Spread fk_nim_khs and group by angkatan
        const groupByAngkatan = result.reduce((r, item) => {
            // Spread fk_nim_khs
            const { fk_nim_khs } = item;
            const khs = fk_nim_khs;
            if (khs.length > 0) {
                const { jumlahSksKumulatif, ipk } = khs[0];
                item.jumlahSksKumulatif = jumlahSksKumulatif;
                item.ipk = ipk;
            } else {
                item.jumlahSksKumulatif = 0;
                item.ipk = 0;
            }
            delete item.fk_nim_khs;

            // Group by angkatan
            if (r[item.angkatan]) {
                r[item.angkatan].push(item);
            } else {
                r[item.angkatan] = [item];
            }

            return r;
        }, {});

        // Create xlsx from json data
        const workbook = xlsx.utils.book_new();
        const filename = `public/documents/daftar-status-${data.nip ?? "all"}.xlsx`;

        Object.keys(groupByAngkatan).forEach((angkatan) => {
            const dataSheet = xlsx.utils.json_to_sheet(groupByAngkatan[angkatan]);
            xlsx.utils.book_append_sheet(workbook, dataSheet, angkatan);
        });

        xlsx.writeFile(workbook, filename);
        return filename;
    } catch (error) {
        throw error;
    }
};

const cetakDaftarPklMahasiswa = async (data) => {
    try {
        const filterWali = data.nip
            ? {
                kodeWali: data.nip,
            }
            : {};

        const result = await prisma.tb_mhs.findMany({
            where: {
                ...filterWali,
            },
            select: {
                nim: true,
                nama: true,
                angkatan: true,
                fk_nim_pkl: {
                    select: {
                        nilai: true,
                        semester: true,
                        statusValidasi: true,
                    },
                },
            },
        });

        // Change status pkl and group by angkatan
        const groupByAngkatan = result.reduce((r, item) => {
            // Change status pkl
            const { fk_nim_pkl } = item;
            if (fk_nim_pkl.length > 0 && fk_nim_pkl[0].statusValidasi === true) {
                item.nilai = fk_nim_pkl[0].nilai;
                item.semester = fk_nim_pkl[0].semester;
            } else {
                item.nilai = "-";
                item.semester = "-";
            }
            delete item.fk_nim_pkl;

            // Group by angkatan
            if (r[item.angkatan]) {
                r[item.angkatan].push(item);
            } else {
                r[item.angkatan] = [item];
            }

            return r;
        }, {});

        // Create xlsx from json data
        const workbook = xlsx.utils.book_new();
        const filename = `public/documents/daftar-pkl-${data.nip ?? "all"}.xlsx`;

        Object.keys(groupByAngkatan).forEach((angkatan) => {
            const dataSheet = xlsx.utils.json_to_sheet(groupByAngkatan[angkatan]);
            xlsx.utils.book_append_sheet(workbook, dataSheet, angkatan);
        });

        xlsx.writeFile(workbook, filename);
        return filename;
    } catch (error) {
        throw error;
    }
};

const cetakDaftarSkripsiMahasiswa = async (data) => {
    try {
        const filterWali = data.nip
            ? {
                kodeWali: data.nip,
            }
            : {};

        const result = await prisma.tb_mhs.findMany({
            where: {
                ...filterWali,
            },
            select: {
                nim: true,
                nama: true,
                angkatan: true,
                fk_nim_skripsi: {
                    select: {
                        nilai: true,
                        statusValidasi: true,
                        tanggalLulusSidang: true,
                        lamaStudi: true,
                        semester: true,
                    },
                },
            },
        });

        // Change status skripsi and group by angkatan
        const groupByAngkatan = result.reduce((r, item) => {
            const { fk_nim_skripsi } = item;
            if (
                fk_nim_skripsi.length > 0 &&
                fk_nim_skripsi[0].statusValidasi === true
            ) {
                item.nilai = fk_nim_skripsi[0].nilai;
                item.tanggalLulusSidang = fk_nim_skripsi[0].tanggalLulusSidang;
                item.lamaStudi = fk_nim_skripsi[0].lamaStudi;
                item.semester = fk_nim_skripsi[0].semester;
            } else {
                item.nilai = "-";
                item.tanggalLulusSidang = "-";
                item.lamaStudi = "-";
                item.semester = "-";
            }
            delete item.fk_nim_skripsi;

            // Group by angkatan
            if (r[item.angkatan]) {
                r[item.angkatan].push(item);
            } else {
                r[item.angkatan] = [item];
            }

            return r;
        }, {});

        // Create xlsx from json data
        const workbook = xlsx.utils.book_new();
        const filename = `public/documents/daftar-status-${data.nip ?? "all"}.xlsx`;

        Object.keys(groupByAngkatan).forEach((angkatan) => {
            const dataSheet = xlsx.utils.json_to_sheet(groupByAngkatan[angkatan]);
            xlsx.utils.book_append_sheet(workbook, dataSheet, angkatan);
        });

        xlsx.writeFile(workbook, filename);
        return filename;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    rekapStatusMahasiswa,
    daftarStatusMahasiswa,
    rekapPklMahasiswa,
    daftarPklMahasiswa,
    rekapSkripsiMahasiswa,
    daftarSkripsiMahasiswa,
    cetakDaftarStatusMahasiswa,
    cetakDaftarPklMahasiswa,
    cetakDaftarSkripsiMahasiswa,
};
