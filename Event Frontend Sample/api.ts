import axios from 'axios';
import { Event } from './Event';

const API_URL = 'http://localhost:5000/api/events';

export const fetchEvents = async (userId: number, start: Date, end: Date): Promise<Event[]> => {
  const response = await axios.get(API_URL, {
    params: {
      userId,
      start: start.toISOString(),
      end: end.toISOString(),
    },
  });
  return response.data;
};