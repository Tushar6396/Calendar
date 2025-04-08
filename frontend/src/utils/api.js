import axios from 'axios';

const API = axios.create({
  baseURL: 'https://calendar-5ez9.onrender.com/api',
});

export const createEvent = (eventData) => API.post('/createEvent', eventData);
export const getEvents = () => API.get('/events');
export const updateEvent = (id, updatedData) => {
  return API.put(`/events/${id}`, updatedData);
};
export default API;
