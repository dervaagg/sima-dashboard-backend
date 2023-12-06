const {
  getDataRegisterMahasiswa,
  updateDataMahasiswa,
  entryDataIrs,
  entryDataKhs,
  entryDataPkl,
  entryDataSkripsi,
  getProfileMahasiswa,
  getDashboardMahasiswa,
} = require('../services/mahasiswaServices');

const { getDataAkademikMhs } = require('../services/dataMahasiswaServices');

const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getDataRegisterMahasiswaController = async (req, res) => {
  const nim = req.id;
  try {
    const result = await getDataRegisterMahasiswa({ nim });
    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

const updateDataMahasiswaController = async (req, res) => {
  const { nim, email, password, alamat, kodeKab, noHP } = req.body;
  const foto = req.file;

  console.log(req.body);

  // check null input
  if (!nim || !email || !password || !alamat || !kodeKab || !foto || !noHP) {
    return res.status(400).json({
      message: 'Data tidak boleh kosong',
    });
  }

  // Check nim
  if (nim != req.id) {
    fs.unlink(`public/documents/${dokumen.originalname}`, (err) => {
      if (err) throw err;
    });
    return res.status(403).json({
      message: 'NIM berbeda dari data login. Entry tidak dapat dilakukan',
    });
  }

  // regex username hanya boleh huruf kecil, angka, dan underscore
  // const regexUsername = /^[a-z0-9_]+$/;
  // //check username (check duplicate sudah ada di service)
  // if (!regexUsername.test(username)) {
  //     return res.status(400).json({
  //         message:
  //             "Username hanya boleh terdiri dari huruf kecil, angka, dan underscore",
  //     });
  // }

  // regex email harus include students.undip.ac.id atau lecturers.undip.ac.id
  const regexEmail = /students.undip.ac.id$/;
  //check email
  if (!regexEmail.test(email)) {
    return res.status(400).json({
      message: 'Email harus menggunakan email Undip',
    });
  }

  // TODO-VALIDATE: check password

  // Check nomor HP (format nomor HP Indonesia)
  const regexNoHP = /^(\+62|62|)8[1-9]{1}[0-9]{8,12}$/;
  if (!regexNoHP.test(noHP)) {
    if (noHP.length < 10 || noHP.length > 13) {
      return res.status(400).json({
        message: 'Nomor HP tidak valid, minimal 9 digit dan maksimal 13 digit',
      });
    }
    return res.status(400).json({
      message: 'Nomor HP tidak valid. Gunakan format (62)',
    });
  }

  // Check format foto
  if (
    path.extname(foto.originalname) !== '.png' &&
    path.extname(foto.originalname) !== '.jpg' &&
    path.extname(foto.originalname) !== '.jpeg'
  ) {
    return res.status(400).json({
      message: 'Format foto harus png,jpg,jpeg',
    });
  }

  try {
    const data = {
      nim,
      email,
      password,
      alamat,
      kodeKab,
      foto,
      noHP,
    };

    const result = await updateDataMahasiswa(data);
    return res.status(200).json({
      message: 'Data berhasil diubah',
      data: result,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ message: err.message });
  }
};

// Edit profile anytime
// const updateProfileMahasiswaController = async (req, res) => {
//     const { nim, email, password, alamat, kodeKab, noHP } =
//         req.body;
//     const foto = req.file;

//     // check null input
//     if (
//         !nim ||
//         !email ||
//         !password ||
//         !alamat ||
//         !kodeKab ||
//         !foto ||
//         !noHP
//     ) {
//         return res.status(400).json({
//             message: "Data tidak boleh kosong",
//         });
//     }

//     // Check nim
//     if (nim != req.id) {
//         fs.unlink(`public/documents/${dokumen.originalname}`, (err) => {
//             if (err) throw err;
//         });
//         return res.status(403).json({
//             message: "NIM berbeda dari data login. Entry tidak dapat dilakukan",
//         });
//     }

//     // // regex username hanya boleh huruf kecil, angka, dan underscore
//     // const regexUsername = /^[a-z0-9_]+$/;
//     // //check username (check duplicate sudah ada di service)
//     // if (!regexUsername.test(username)) {
//     //     return res.status(400).json({
//     //         message:
//     //             "Username hanya boleh terdiri dari huruf kecil, angka, dan underscore",
//     //     });
//     // }

//     // regex email harus include students.undip.ac.id atau lecturers.undip.ac.id
//     const regexEmail = /students.undip.ac.id$/;
//     //check email
//     if (!regexEmail.test(email)) {
//         return res.status(400).json({
//             message: "Email harus menggunakan email Undip",
//         });
//     }

//     // TODO-VALIDATE: check password

//     // Check nomor HP (format nomor HP Indonesia)
//     const regexNoHP = /^(\+62|62|)8[1-9]{1}[0-9]{8,12}$/;
//     if (!regexNoHP.test(noHP)) {
//         if (noHP.length < 10 || noHP.length > 13) {
//             return res.status(400).json({
//                 message: "Nomor HP tidak valid, minimal 9 digit dan maksimal 13 digit",
//             });
//         }
//         return res.status(400).json({
//             message: "Nomor HP tidak valid. Gunakan format (62)",
//         });
//     }

//     // Check format foto
//     if (
//         path.extname(foto.originalname) !== ".png" &&
//         path.extname(foto.originalname) !== ".jpg" &&
//         path.extname(foto.originalname) !== ".jpeg"
//     ) {
//         return res.status(400).json({
//             message: "Format foto harus png,jpg,jpeg",
//         });
//     }

//     try {
//         const data = {
//             nim,
//             email,
//             password,
//             alamat,
//             kodeKab,
//             foto,
//             noHP,
//         };

//         const result = await updateDataMahasiswa(data);
//         return res.status(200).json({
//             message: "Data berhasil diubah",
//             data: result,
//         });
//     } catch (err) {
//         console.log(err.message);
//         return res.status(400).json({ message: err.message });
//     }
// };

// Dashboard dan profile
const getDashboardMahasiswaController = async (req, res) => {
  const nim = req.id;

  try {
    const data = { nim };
    const result = await getDashboardMahasiswa(data);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const getProfileMahasiswaController = async (req, res) => {
  try {
    const result = await getProfileMahasiswa({ nim: req.id });
    return res.status(200).json({
      message: 'Data berhasil diambil',
      data: result,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ message: err.message });
  }
};

// !!! CHECK APAKAH SEMESTER YANG AKAN DIINPUT VALID
const entryDataIrsController = async (req, res) => {
  let { nim, semester, status, jumlahSks, oldSemester } = req.body;
  const dokumen = req.file;

  // check null input
  if (!nim || !semester || !status.trim() || !jumlahSks) {
    if (dokumen) {
      fs.unlink(`public/documents/${dokumen.originalname}`, (err) => {
        if (err) throw err;
      });
    }
    return res.status(400).json({
      message: 'Data tidak boleh kosong',
    });
  }

  // Check nim
  if (nim != req.id) {
    if (dokumen) {
      fs.unlink(`public/documents/${dokumen.originalname}`, (err) => {
        if (err) throw err;
      });
    }
    return res.status(403).json({
      message: 'NIM berbeda dari data login. Entry tidak dapat dilakukan',
    });
  }

  // Check semester di service

  // Check status
  const statusIRS = ['Aktif', 'Cuti'];
  if (!statusIRS.includes(status)) {
    if (dokumen) {
      fs.unlink(`public/documents/${dokumen.originalname}`, (err) => {
        if (err) throw err;
      });
    }
    return res.status(400).json({
      message: 'Status IRS tidak valid',
    });
  }

  // Check jumlah sks
  if (jumlahSks < 0 || jumlahSks > 24) {
    if (dokumen) {
      fs.unlink(`public/documents/${dokumen.originalname}`, (err) => {
        if (err) throw err;
      });
    }
    return res.status(400).json({
      message: 'Jumlah SKS tidak valid',
    });
  }

  // Check file
  if (dokumen) {
    if (path.extname(dokumen.originalname) !== '.pdf') {
      // Errornya ngga json?

      fs.unlink(`public/documents/${dokumen.originalname}`, (err) => {
        if (err) throw err;
      });
      return res.status(400).json({
        message: 'Format dokumen harus pdf',
      });
    }
  }

  try {
    const data = {
      nim,
      semester,
      status,
      jumlahSks,
      dokumen,
      oldSemester,
    };

    const result = await entryDataIrs(data);
    return res.status(200).json({
      message: 'Entry data IRS berhasil',
      data: result,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ message: err.message });
  }
};

// TODO: refactor unlink file while deleting
const entryDataKhsController = async (req, res) => {
  const {
    nim,
    semester,
    status,
    jumlahSksSemester,
    ips,
    jumlahSksKumulatif,
    ipk,
    oldSemester,
  } = req.body;
  const dokumen = req.file;

  // check null input
  if (
    !nim ||
    !semester ||
    !status.trim() ||
    !jumlahSksSemester ||
    !ips ||
    !jumlahSksKumulatif ||
    !ipk
  ) {
    if (dokumen) {
      fs.unlink(`public/documents/${dokumen.originalname}`, (err) => {
        if (err) throw err;
      });
    }
    return res.status(400).json({
      message: 'Data tidak boleh kosong',
    });
  }

  // Check nim
  if (nim != req.id) {
    if (dokumen) {
      fs.unlink(`public/documents/${dokumen.originalname}`, (err) => {
        if (err) throw err;
      });
    }
    return res.status(403).json({
      message: 'NIM berbeda dari data login. Entry tidak dapat dilakukan',
    });
  }

  // TODO-VALIDATE: validasi status KHS

  // Check jumlah sks
  if (jumlahSksSemester < 0 || jumlahSksSemester > 24) {
    if (dokumen) {
      fs.unlink(`public/documents/${dokumen.originalname}`, (err) => {
        if (err) throw err;
      });
    }
    return res.status(400).json({
      message: 'Jumlah SKS tidak valid',
    });
  }

  // Check IPS
  if (parseFloat(ips) < 0 || parseFloat(ips) > 4) {
    if (dokumen) {
      fs.unlink(`public/documents/${dokumen.originalname}`, (err) => {
        if (err) throw err;
      });
    }
    return res.status(400).json({
      message: 'IPS tidak valid',
    });
  }

  // TODO-VALIDATE: validasi jumlah sks kumulatif

  // Check IPK
  if (parseFloat(ipk) < 0 || parseFloat(ipk) > 4) {
    if (dokumen) {
      fs.unlink(`public/documents/${dokumen.originalname}`, (err) => {
        if (err) throw err;
      });
    }
    return res.status(400).json({
      message: 'IPK tidak valid',
    });
  }

  // Check dokumen

  if (dokumen && path.extname(dokumen.originalname) !== '.pdf') {
    fs.unlink(`public/documents/${dokumen.originalname}`, (err) => {
      if (err) throw err;
    });
    return res.status(400).json({
      message: 'Format dokumen harus pdf',
    });
  }

  try {
    const data = {
      nim,
      semester,
      status,
      jumlahSksSemester,
      ips,
      jumlahSksKumulatif,
      ipk,
      dokumen,
      oldSemester,
    };

    const result = await entryDataKhs(data);
    return res.status(200).json({
      message: 'Entry data KHS berhasil ',
      data: result,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ message: err.message });
  }
};

const entryDataPklController = async (req, res) => {
  const { nim, semester, nilai, oldSemester } = req.body;
  const dokumen = req.file;

  // check null input
  if (!nim || !semester || !nilai) {
    if (dokumen) {
      fs.unlink(`public/documents/${dokumen.originalname}`, (err) => {
        if (err) throw err;
      });
    }
    return res.status(400).json({
      message: 'Data tidak boleh kosong',
    });
  }
  // Check nim
  if (nim != req.id) {
    if (dokumen) {
      fs.unlink(`public/documents/${dokumen.originalname}`, (err) => {
        if (err) throw err;
      });
    }
    return res.status(403).json({
      message: 'NIM berbeda dari data login. Entry tidak dapat dilakukan',
    });
  }

  // Check semester | Done in service

  // TODO-VALIDATE: validasi nilai PKL

  if (dokumen && path.extname(dokumen.originalname) !== '.pdf') {
    if (dokumen) {
      fs.unlink(`public/documents/${dokumen.originalname}`, (err) => {
        if (err) throw err;
      });
    }
    return res.status(400).json({
      message: 'Format dokumen harus pdf',
    });
  }

  try {
    const data = {
      nim,
      semester,
      nilai,
      dokumen,
      oldSemester,
    };

    const result = await entryDataPkl(data);
    return res.status(200).json({
      message: 'Entry data progress PKL berhasil',
      data: result,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ message: err.message });
  }
};

const entryDataSkripsiController = async (req, res) => {
  const { nim, semester, nilai, tanggalLulusSidang, lamaStudi, oldSemester } =
    req.body;
  const dokumen = req.file;

  // check null input
  if (!nim || !semester || !nilai || !tanggalLulusSidang || !lamaStudi) {
    if (dokumen) {
      fs.unlink(`public/documents/${dokumen.originalname}`, (err) => {
        if (err) throw err;
      });
    }
    return res.status(400).json({
      message: 'Data tidak boleh kosong',
    });
  }

  // Check nim
  if (nim != req.id) {
    if (dokumen) {
      fs.unlink(`public/documents/${dokumen.originalname}`, (err) => {
        if (err) throw err;
      });
    }
    return res.status(403).json({
      message: 'NIM berbeda dari data login. Entry tidak dapat dilakukan',
    });
  }

  // Check semester | Done in service
  // TODO-VALIDATE: Check nilai skripsi, lama studi, dan tanggalLulusSidang

  if (dokumen && path.extname(dokumen.originalname) !== '.pdf') {
    return res.status(400).json({
      message: 'Format dokumen harus pdf',
    });
  }

  try {
    const data = {
      nim,
      semester,
      nilai,
      tanggalLulusSidang,
      dokumen,
      lamaStudi,
      oldSemester,
    };

    const result = await entryDataSkripsi(data);
    return res.status(200).json({
      message: 'Entry data progress Skripsi berhasil',
      data: result,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ message: err.message });
  }
};

const getListIRSController = async (req, res) => {
  const nim = req.id;
  if (!nim) {
    return res.status(400).json({ message: 'NIM tidak boleh kosong' });
  }

  try {
    const result = await prisma.tb_irs.findMany({
      where: {
        nim: nim,
      },
      orderBy: {
        semester: 'desc',
      },
    });

    return res.status(200).json({
      message: 'data mahasiswa berhasil diambil',
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

const getListKHSController = async (req, res) => {
  const nim = req.id;
  if (!nim) {
    return res.status(400).json({ message: 'NIM tidak boleh kosong' });
  }

  try {
    const result = await prisma.tb_khs.findMany({
      where: {
        nim: nim,
      },
      orderBy: {
        semester: 'desc',
      },
    });

    return res.status(200).json({
      message: 'data mahasiswa berhasil diambil',
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

const getListPKLController = async (req, res) => {
  const nim = req.id;
  if (!nim) {
    return res.status(400).json({ message: 'NIM tidak boleh kosong' });
  }

  try {
    const result = await prisma.tb_pkl.findMany({
      where: {
        nim: nim,
      },
      orderBy: {
        semester: 'desc',
      },
    });

    return res.status(200).json({
      message: 'data mahasiswa berhasil diambil',
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

const getListSkripsiController = async (req, res) => {
  const nim = req.id;
  if (!nim) {
    return res.status(400).json({ message: 'NIM tidak boleh kosong' });
  }

  try {
    const result = await prisma.tb_skripsi.findMany({
      where: {
        nim: nim,
      },
      orderBy: {
        semester: 'desc',
      },
    });

    return res.status(200).json({
      message: 'data mahasiswa berhasil diambil',
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

module.exports = {
  getDataRegisterMahasiswaController,
  updateDataMahasiswaController,

  getDashboardMahasiswaController,
  getProfileMahasiswaController,
  updateProfileMahasiswaController,

  getListIRSController,
  getListPKLController,
  getListKHSController,
  getListSkripsiController,

  entryDataIrsController,
  entryDataKhsController,
  entryDataPklController,
  entryDataSkripsiController,
};
