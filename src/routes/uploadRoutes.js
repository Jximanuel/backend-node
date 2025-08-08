   // routes/uploadRoutes.js
   const express = require('express');
   const upload = require('..//middleware/upload');
   const { uploadScedule, getSchedule, deleteSchedule } = require('../controller/uploadController');

   const router = express.Router();

   router.post('/', upload.single('image'), uploadScedule);
   router.get('/', getSchedule) // Rute untuk mengupload gambar
   router.delete('/:id', deleteSchedule)
   
   module.exports = router;
   