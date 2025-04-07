import express from 'express';

const router = express.Router();

import {
  createEvent,
  getAllEvents,
  updateEvent,
} from '../controllers/eventController.js';

router.post('/createEvent', createEvent);
router.get('/events', getAllEvents);
router.put('/events/:id', updateEvent);

export default router;
