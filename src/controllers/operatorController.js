const fs = require("fs");
const {
    getDataDosen,
    getAkunMahasiswa,
    addMahasiswa,
    batchAddMahasiswa,
    getJumlahAkunMahasiswa,
    cetakDaftarAkunMahasiswa,
    getAkunDosen,
    addDosen,
    cetakDaftarAkunDosen,
    updateStatusAkunMhs,
    getJumlahAkunDosen,
    updateStatusAkunDosen,
} = require("../services/operatorServices");

const getDataDosenController = async (req, res) => {
    try {
        const result = await getDataDosen();
        return res.json(result);
    } catch (err) {
        return res.status(403).json({ message: err.message });
    }
};

// =================== Mahasiswa ====================
const getAkunMahasiswaController = async (req, res) => {
    const path = req.path;
    let { page, qty, sortBy, order, keyword } = req.query;

    if (!page) page = 1;
    if (!qty) qty = 5;
    if (!order) order = "asc";

    // Check params
    if (isNaN(page) || isNaN(qty) || !["asc", "desc"].includes(order))
        return res.status(400).json({ message: "Bad request. Params not valid" });
    page = parseInt(page);
    qty = parseInt(qty);

    try {
        const data = { page, qty, sortBy, order, keyword };
        const result = await getAkunMahasiswa(data);
        return res.json(result);
    } catch (err) {
        return res.status(403).json({ message: err.message });
    }
};

const getAkunDosenController = async (req, res) => {
    let { page, qty, sortBy, order, keyword } = req.query;

    if (!page) page = 1;
    if (!qty) qty = 5;
    if (!order) order = "asc";

    // Check params
    if (isNaN(page) || isNaN(qty) || !["asc", "desc"].includes(order))
        return res.status(400).json({ message: "Bad request. Params not valid" });
    page = parseInt(page);
    qty = parseInt(qty);

    // Check params
    if (isNaN(page) || isNaN(qty))
        return res.status(400).json({ message: "Bad request. Params not valid" });
    page = parseInt(page);
    qty = parseInt(qty);

    try {
        const data = { page, qty, sortBy, order, keyword };
        const result = await getAkunDosen(data);
        return res.json(result);
    } catch (err) {
        return res.status(403).json({ message: err.message });
    }
};

const addMahasiswaController = async (req, res) => {
    const {
        username,
        namaLengkap,
        nim,
        angkatan,
        password,
        status,
        jalurMasuk,
        dosenWali,
    } = req.body;

    if (
        !username.trim() ||
        !namaLengkap.trim() ||
        !nim ||
        !angkatan ||
        !password.trim() ||
        !status.trim() ||
        !jalurMasuk.trim() ||
        !dosenWali.trim()
    ) {
        return res
            .status(400)
            .json({ message: "Paramater tidak boleh ada yang kosong" });
    }

    // regex username hanya boleh huruf kecil, angka, dan underscore
    const regexUsername = /^[a-z0-9_]+$/;
    //check username (check duplicate sudah ada di service)
    if (!regexUsername.test(username)) {
        return res.status(400).json({
            message:
                "Username hanya boleh terdiri dari huruf kecil, angka, dan underscore",
        });
    }

    // Check nama
    const regexNama = /^[A-Za-z ,']+$/;
    if (!regexNama.test(namaLengkap)) {
        return res.status(400).json({
            message:
                "Nama hanya boleh terdiri dari huruf besar/kecil, spasi, koma, atau tanda petik",
        });
    }

    // Check NIM
    if (nim.length != 14) {
        return res.status(400).json({
            message: "NIM harus terdiri dari 14 digit",
        });
    } else if (!nim.startsWith("2406")) {
        return res.status(400).json({
            message: "NIM harus dimulai dengan 2406",
        });
    }

    // Check angkatan
    if (
        angkatan < 1950 ||
        angkatan > new Date().getFullYear() - (new Date().getMonth() > 6 ? 0 : 1)
    ) {
        return res.status(400).json({
            message: "Angkatan tidak valid",
        });
    }

    // Check status,
    const statusMhs = [
        "Aktif",
        "Cuti",
        "Lulus",
        "Mangkir",
        "DO",
        "UndurDiri",
        "MeninggalDunia",
    ];
    if (!statusMhs.includes(status)) {
        return res.status(400).json({
            message: "Status tidak valid",
        });
    }

    // Check jalurMasuk,
    const allJalurMasuk = ["SBMPTN", "SNMPTN", "Mandiri", "Lainnya"];
    if (!allJalurMasuk.includes(jalurMasuk)) {
        return res.status(400).json({
            message: "Jalur masuk tidak valid",
        });
    }

    // Doswal already checked in service

    try {
        const result = await addMahasiswa({
            username,
            namaLengkap,
            nim,
            angkatan,
            password,
            status,
            jalurMasuk,
            dosenWali,
        });
        return res.status(200).json({ message: "Mahasiswa berhasil ditambahkan" });
    } catch (err) {
        return res.status(403).json({ message: err.message });
    }
};

const addDosenController = async (req, res) => {
    const { username, namaLengkap, nip, password } = req.body;

    if (
        !username.trim() ||
        !namaLengkap.trim() ||
        !nip.trim() ||
        !password.trim()
    )
        return res
            .status(400)
            .json({ message: "Paramater tidak boleh ada yang kosong" });

    // regex username hanya boleh huruf kecil, angka, dan underscore
    const regexUsername = /^[a-z0-9_]+$/;
    //check username (check duplicate sudah ada di service)
    if (!regexUsername.test(username)) {
        return res.status(400).json({
            message:
                "Username hanya boleh terdiri dari huruf kecil, angka, dan underscore",
        });
    }

    // Check nama
    const regexNama = /^[A-Za-z ,'.]+$/;
    if (!regexNama.test(namaLengkap)) {
        return res.status(400).json({
            message:
                "Nama hanya boleh terdiri dari huruf besar/kecil, spasi, koma, atau tanda petik",
        });
    }

    try {
        const result = await addDosen({
            username,
            namaLengkap,
            nip,
            password,
        });
        return res.status(200).json({ message: "Dosen berhasil ditambahkan" });
    } catch (err) {
        return res.status(403).json({ message: err.message });
    }
};

const batchAddMahasiswaController = async (req, res) => {
    const dokumen = req.file;
    const data = { dokumen };
    try {
        const result = await batchAddMahasiswa(data);
        return res.status(200).json({ message: result });
    } catch (err) {
        return res.status(403).json({ message: err.message });
    }
};

const getJumlahAkunMahasiswaController = async (req, res) => {
    try {
        const result = await getJumlahAkunMahasiswa();
        return res.json(result);
    } catch (err) {
        return res.status(403).json({ message: err.message });
    }
};

const getJumlahAkunDosenController = async (req, res) => {
    try {
        const result = await getJumlahAkunDosen();
        return res.status(200).json(result);
    } catch (err) {
        return res.status(403).json({ message: err.message });
    }
};

const cetakDaftarAkunMahasiswaController = async (req, res) => {
    try {
        const data = {};

        const result = await cetakDaftarAkunMahasiswa(data);
        return res.status(200).download(result, (err) => {
            if (err) {
                console.log(err);
                // res.status(400).json({
                //   message: err.message
                // })
            }
            fs.unlinkSync(result);
            // return res.status(200).json({
            //   message: "File berhasil di download"
            // })
        });
    } catch (err) {
        return res.status(400).json({
            message: err.message,
        });
    }
};

const cetakDaftarAkunDosenController = async (req, res) => {
    try {
        const data = {};

        const result = await cetakDaftarAkunDosen(data);

        return res.status(200).download(result, (err) => {
            if (err) {
                console.log(err);
                // res.status(400).json({
                //   message: err.message
                // })
            }
            fs.unlinkSync(result);
            // return res.status(200).json({
            //   message: "File berhasil di download"
            // })
        });
    } catch (err) {
        return res.status(400).json({
            message: err.message,
        });
    }
};

const updateStatusAkunMhsController = async (req, res) => {
    const { nim } = req.params;

    if (!nim) {
        return res.status(400).json({
            message: "Data tidak boleh kosong",
        });
    }

    try {
        const data = { nim };
        const result = await updateStatusAkunMhs(data);

        return res
            .status(200)
            .json({ data: result, message: "Status aktif berhasil diupdate" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

const updateStatusAkunDosenController = async (req, res) => {
    const { nip } = req.params;

    if (!nip) {
        return res.status(400).json({
            message: "Data tidak boleh kosong",
        });
    }

    try {
        const data = { nip };
        const result = await updateStatusAkunDosen(data);

        return res
            .status(200)
            .json({ data: result, message: "Status aktif berhasil diupdate" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getDataDosenController,
    getAkunMahasiswaController,
    addMahasiswaController,
    batchAddMahasiswaController,
    getJumlahAkunMahasiswaController,
    cetakDaftarAkunMahasiswaController,
    updateStatusAkunMhsController,
    getAkunDosenController,
    addDosenController,
    getJumlahAkunDosenController,
    cetakDaftarAkunDosenController,
    updateStatusAkunDosenController,
};
