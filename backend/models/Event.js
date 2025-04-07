import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: String,
  category: String,
  date: String,
  startTime: String,
  endTime: String,
});

export default mongoose.model('Event', eventSchema);
