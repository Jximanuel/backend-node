   // controllers/uploadController.js
   const cloudinary = require('../config/cloudinary');
   const scheduleSchema = require("../models/Schedule")
   const fs = require('fs');


 const uploadScedule = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { name, date, time } = req.body;
    if (!name || !date || !time) {
      fs.unlinkSync(req.file.path); // hapus file kalau tidak valid
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const newSchedule = new scheduleSchema({
      name,
      imageUrl: result.secure_url,
      date: new Date(date),
      time,
      publicId : result.public_id
    });

    await newSchedule.save();
    fs.unlinkSync(req.file.path);

    res.status(200).json({ message: 'Schedule uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading schedule', error: error.message });
  }
};



 const getSchedule = async ( req, res) =>{
   try {
    const schedules = await scheduleSchema.find().sort({ createdAt: -1})
    res.status(200).json(schedules)
   } catch (error) {
    res.status(400).json({message:" Error fetching schedules" })
   }
 }

 const deleteSchedule = async (req, res) => {
  try {
    const schedule = await scheduleSchema.findById(req.params.id)
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" })
    }
    await cloudinary.uploader.destroy(schedule.publicId);


    await scheduleSchema.deleteOne({ _id: req.params.id })

    res.status(200).json({ message: "Schedule deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error deleting schedule', error: error.message })
  }
}


 module.exports = {
  uploadScedule,
  getSchedule,
  deleteSchedule
 }
