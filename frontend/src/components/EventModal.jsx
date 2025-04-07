import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { createEvent, updateEvent } from '../utils/api.js';
import { addEvent, updateEventAsync } from '../redux/calendarSlice.js';

const categories = ['exercise', 'eating', 'work', 'relax', 'family', 'social'];

const EventModal = ({ isOpen, onClose, initialData }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || 'work');
  const [date, setDate] = useState(initialData?.date || '');
  const [startTime, setStartTime] = useState(initialData?.startTime || '');
  const [endTime, setEndTime] = useState(initialData?.endTime || '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      title,
      category,
      date,
      startTime,
      endTime,
    };

    try {
      if (initialData?._id) {
        const updatedEvent = await dispatch(
          updateEventAsync({ id: initialData._id, updatedData: newEvent })
        ).unwrap();
        console.log('Event updated: ', updatedEvent);
      } else {
        const response = await createEvent(newEvent);
        if (response.data.success) {
          dispatch(addEvent(response.data.newEvent));
          console.log('Event Created: ', response.data);
        } else {
          console.error('Backend error ', response.data.message);
        }
      }
    } catch (error) {
      console.error('Failed to save event:', error);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-opacity-10 z-50'>
      <div
        className='fixed inset-0 z-50 bg-opacity-10 flex items-center justify-center'
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose(); // Only close if clicked on backdrop
        }}
      >
        <form
          onSubmit={handleSubmit}
          className='bg-white border-2 border-gray-300 rounded-2xl shadow-2xl p-6 w-[90%] max-w-md'
        >
          <h2 className='text-xl font-bold mb-4'>Create Event</h2>

          <div className='mb-3'>
            <label className='block text-sm font-medium'>Title</label>
            <input
              type='text'
              className='w-full border p-2 rounded'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className='mb-3'>
            <label className='block text-sm font-medium'>Category</label>
            <select
              className='w-full border p-2 rounded'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className='mb-3'>
            <label className='block text-sm font-medium'>Date</label>
            <input
              type='date'
              className='w-full border p-2 rounded'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className='flex gap-4 mb-3'>
            <div className='flex-1'>
              <label className='block text-sm font-medium'>Start Time</label>
              <input
                type='time'
                className='w-full border p-2 rounded'
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className='flex-1'>
              <label className='block text-sm font-medium'>End Time</label>
              <input
                type='time'
                className='w-full border p-2 rounded'
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 border rounded hover:bg-gray-100'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
