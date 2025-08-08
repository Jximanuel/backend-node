   // middleware/upload.js
   const multer = require('multer');
   const path = require('path');

   const storage = multer.diskStorage({
     destination: (req, file, cb) => {
       cb(null, 'upload/'); // Folder untuk menyimpan file sementara
     },
     filename: (req, file, cb) => {
       cb(null, file.originalname); // Menggunakan nama asli file
     },
   });

   const upload = multer({ storage });

   module.exports = upload;
   