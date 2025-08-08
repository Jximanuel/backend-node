const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createGallery, getGallery, deleteGallery } = require('../controller/galleryController');

// Konfigurasi Multer untuk menerima file gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/'); // folder sementara
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Route untuk upload gambar (admin)
router.post('/gallery', upload.single('image'), createGallery);

// Route untuk ambil semua gambar gallery
router.get('/gallery', getGallery);

// Route untuk hapus gambar by ID (admin)
router.delete('/gallery/:id', deleteGallery);

module.exports = router;
