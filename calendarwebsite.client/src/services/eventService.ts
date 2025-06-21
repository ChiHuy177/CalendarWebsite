import { Event } from "../interfaces/event";

export const fetchEvents = async (userId: number, start: Date, end: Date): Promise<Event[]> => {
  try {
    const response = await fetch(`/api/Events?userId=${userId}&start=${start.toISOString()}&end=${end.toISOString()}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching events: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};