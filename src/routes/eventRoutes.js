// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { createEvent, getEvents, getEventId, deleteEvent } = require('../controller/eventController');

router.post('/events', upload.single('image'), createEvent);
router.get('/events', getEvents);
router.get('/events/:id', getEventId);
router.delete('/events/:id', deleteEvent);

module.exports = router;
