const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,

  },

  imageUrl: {
    type: String,
    required: true,
  },

  publicId: {
    type: String,
    required: true,
  },

  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const Gallery = mongoose.model('Gallery', gallerySchema);
module.exports = Gallery;
