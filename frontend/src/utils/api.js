import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const createEvent = (eventData) => API.post('/createEvent', eventData);
export const getEvents = () => API.get('/events');
export const updateEvent = (id, updatedData) => {
  return API.put(`/events/${id}`, updatedData);
};
export default API;
