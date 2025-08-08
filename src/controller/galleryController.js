const cloudinary = require('cloudinary').v2;
const Gallery = require('../models/GalleryModel');
const fs = require('fs');
const sharp = require('sharp');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const createGallery = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const resizePath = `resized-${req.file.filename}`;
    await sharp(req.file.path)
      .resize(1080, 1080, { fit: "cover" })
      .toFile(resizePath);

    const result = await cloudinary.uploader.upload(resizePath, {
      folder: "gallery"
    });

    const newImage = new Gallery({
      imageUrl: result.secure_url,
      publicId: result.public_id,
      createdAt: new Date()  // pastikan di schema juga
    });

    await newImage.save();

    fs.unlinkSync(req.file.path);
    fs.unlinkSync(resizePath);

    res.status(201).json({ message: "Gallery created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading image", error: error.message });
  }
};

const getGallery = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch gallery images", error: error.message });
  }
};

const deleteGallery = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    await cloudinary.uploader.destroy(image.publicId);
    await Gallery.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting image", error: error.message });
  }
};

module.exports = {
  createGallery,
  getGallery,
  deleteGallery
};
