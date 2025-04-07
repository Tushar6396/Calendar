import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createEvent,
  getEvents,
  updateEvent as updateEventAPI,
} from '../utils/api';

export const fetchEvents = createAsyncThunk(
  'calendar/fetchEvents',
  async () => {
    const response = await getEvents();
    return response.data;
  }
);

export const createEventAsync = createAsyncThunk(
  'calendar/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await createEvent(eventData);
      if (response.data.success) {
        return response.data.event;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateEventAsync = createAsyncThunk(
  'calendar/updateEvent',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await updateEventAPI(id, updatedData);
      if (response.data?.success) {
        return { id, updatedEvent: response.data.updatedEvent };
      } else {
        return rejectWithValue(
          response.data?.message || 'Updation failed miserably'
        );
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: {
    events: [],
  },
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action) => {
      const index = state.events.findIndex((e) => e._id === action.payload._id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = action.payload.events;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createEventAsync.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(updateEventAsync.fulfilled, (state, action) => {
        const { id, updatedEvent } = action.payload;
        const index = state.events.findIndex((e) => e._id === id);
        if (index !== -1) {
          state.events[index] = { ...state.events[index], ...updatedEvent };
        }
      })
      .addCase(updateEventAsync.rejected, (state, action) => {
        console.error('Update event failed');
      });
  },
});

export const { setEvents, addEvent, updateEvent } = calendarSlice.actions;
export const selectEvents = (state) => state.calendar.events;

export default calendarSlice.reducer;
