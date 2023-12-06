const multer = require('multer');
const path = require('path');

const uploadPDF = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/documents/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  limits: {
    fileSize: 52428800,
  },
  fileFilter: (req, file, cb) => {
    if (!file) {
      return cb(new Error('Tidak ada dokumen yang terkirim'), false);
    } else if (path.extname(file.originalname) == '.pdf') {
      return cb(null, true);
    } else {
      return cb(new Error('Format dokumen harus PDF'), false);
    }
  },
});

const uploadDokumen = (req, res, next) => {
  const upload = uploadPDF.single('dokumen');
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

const uploadExcel = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/documents/data-mhs/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  limits: {
    fileSize: 52428800,
  },
  fileFilter: (req, file, cb) => {
    if (!file) {
      return cb(new Error('Tidak ada dokumen yang terkirim'), false);
    } else if (
      path.extname(file.originalname) == '.csv' ||
      path.extname(file.originalname) == '.xlsx'
    ) {
      return cb(null, true);
    } else {
      return cb(new Error('Format dokumen harus CSV / XLSX'), false);
    }
  },
});

const uploadExcelMhs = (req, res, next) => {
  const upload = uploadExcel.single('dokumen');
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

const uploadImage = multer({
  limits: {
    fileSize: 52428800,
  },
});

const uploadFotoProfil = (req, res, next) => {
  const upload = uploadImage.single('foto');
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

module.exports = {
  uploadImage,
  uploadPDF,
  uploadExcel,
  uploadDokumen,
  uploadExcelMhs,
  uploadFotoProfil,
};
