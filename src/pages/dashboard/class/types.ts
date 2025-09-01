export interface Class {
  id: string;
  title: string;
  startTime: string; // UTC time string (e.g., "2024-01-15T09:00:00Z")
  endTime: string;   // UTC time string (e.g., "2024-01-15T10:30:00Z")
  instructor: string;
  classLink: string;
  category: string;
}

export interface CalendarProps {
  classes: Class[];
}