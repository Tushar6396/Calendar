import Event from '../models/Event.js';

const createEvent = async (req, res) => {
  try {
    const { title, category, date, startTime, endTime } = req.body;
    if (!title || !category || !date || !startTime || !endTime) {
      return res.json({ success: false, message: 'All fields are required' });
    }
    const event = new Event({ title, category, date, startTime, endTime });
    await event.save();
    res
      .status(201)
      .json({ success: true, message: 'Event created successfully', event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return res
        .status(404)
        .json({ success: false, message: 'Event updated successfully' });
    }
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      updatedEvent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { createEvent, getAllEvents, updateEvent };
