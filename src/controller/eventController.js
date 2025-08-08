const cloudinary = require('../config/cloudinary');
const Event = require("../models/EventModel")
const fs = require('fs');


const createEvent = async ( req, res) =>{
   try {
      if(!req.file){
         return res.status(400).json({message: "Please upload a file"})
      }

      const {name, date, time, location} = req.body
      if(!name || !date || !time  || !location){
         return res.status(400).json({message: "Please fill in all fields"})
      }

      const result = await cloudinary.uploader.upload(req.file.path)

      const newEvent = new Event ({
         name,
         imageUrl : result.secure_url,
         publicId :  result.public_id,
         date: new Date(date),
          time,
          location
      })


      await newEvent.save()

      fs.unlinkSync(req.file.path)

      res.status(201).json({ message: "Event created successfully" , event: newEvent})
   } catch (error) {
       console.error(error);
    res.status(500).json({ message: 'Error creating event', error: error.message });
  
   }
}

const getEvents = async (req, res) => {
   try {
      const events = await Event.find().sort({date: 1})
      res.status(200).json(events)
   } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error fetching events', error: error.message });
   }
}


const getEventId = async (req, res) =>{
   try {
    const event = await Event.findById(req.params.id)
    if(!event) return res.status(404).json({message: "Event not found"})

   res.status(201).json({message: "Event found", event})
   }catch{
       res.status(500).json({message: "Error fetching event", error: error.message})
   }
}


const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Hapus gambar dari cloudinary
    await cloudinary.uploader.destroy(event.publicId);

    // Hapus dari database
    await event.deleteOne();

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};


module.exports = {
   createEvent,
   getEvents,
   getEventId,
   deleteEvent

}
