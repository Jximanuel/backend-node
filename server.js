const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require('./src/routes/userRoutes');
const User = require("./src/models/userModel");
const uploadRoutes = require('./src/routes/uploadRoutes');
const galleryRoutes = require('./src/routes/galleryRoutes')
const bcrypt = require("bcryptjs");
const path = require('path');
const fs = require('fs'); // Pastikan fs diimpor
const eventRoutes = require('./src/routes/eventRoutes');
require('dotenv').config();
const cors = require("cors")

const app = express();

// Middleware untuk parsing JSON
app.use(express.json());

// Fungsi untuk membuat admin
const createAdmin = async () => {
    const existingAdmin = await User.findOne({ username: "admin" });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

        const adminUser  = new User({
            username: "admin",
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin"
        });

        await adminUser .save();
        console.log("User  admin dibuat");
    } else {
        console.log("User  admin sudah ada");
    }
};

// Membuat folder upload jika belum ada
const uploadsDir = path.join(__dirname, 'upload'); // Pastikan nama folder sesuai
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to MongoDB");
    createAdmin();
})
.catch((err) => console.log("Error connecting to MongoDB", err));




// Menggunakan rute
app.use(cors({
  origin: 'http://localhost:5173', 
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', "authorization"],// URL frontend
}));

app.use('/api/users', userRoutes);
app.use('/upload', uploadRoutes);
app.use('/api', eventRoutes);
app.use('/api', galleryRoutes)


// Route untuk menguji server
app.get('/', (req, res) => {
    res.send('Cloudinary Upload Backend is running');
});

// Menjalankan server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server is running on port", port));
