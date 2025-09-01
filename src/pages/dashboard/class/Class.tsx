import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  getUserTimezone,
  convertUTCToLocalTime,
  formatTime,
  isCurrentTimeInRange,
  getCurrentTimePosition
} from './timeUtils';
import './Calendar.scss';
import type { Class } from './types';
import TeacherApiService from '../teacher/teacherApiService';


const calendar = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [userTimezone, setUserTimezone] = useState<string>('');
  const [classData, setClassData] = useState<Class[]>([]);

  const getClassDataHandler = async () => {
    const response = await TeacherApiService.getClassList();
    setClassData(response.classes as Class[]);
  }

  useEffect(() => {
    getClassDataHandler();
    setUserTimezone(getUserTimezone());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const currentDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const generateTimeMarkers = () => {
    const markers = [];
    for (let hour = 0; hour < 24; hour++) {
      markers.push(
        <div
          key={hour}
          className="time-marker"
          style={{ top: `${(hour / 24) * 100}%` }}
        >
          <span className="time-label">
            {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
          </span>
        </div>
      );
    }
    return markers;
  };

  const getClassPosition = (startTime: Date, endTime: Date) => {
    const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
    const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();
    const duration = endMinutes - startMinutes;
    
    return {
      top: `${(startMinutes / (24 * 60)) * 100}%`,
      height: `${(duration / (24 * 60)) * 100}%`
    };
  };

  const handleClassClick = (classLink: string) => {
    window.open(classLink, '_blank');
  };

  if (!userTimezone) {
    return (
      <Paper className="calendar-container">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography>Loading timezone information...</Typography>
        </Box>
      </Paper>
    );
  }

  const filteredClasses = classData.filter(classItem => {
    const localStartTime = convertUTCToLocalTime(classItem.startTime, userTimezone);
    return localStartTime.toDateString() === currentTime.toDateString();
  });

  return (
    <Paper className="calendar-container">
      <div className="calendar-header">
        <Typography variant="h4" className="calendar-date">
          {currentDate}
        </Typography>
        <Typography variant="body2" className="calendar-timezone">
          Your timezone: {userTimezone}
        </Typography>
      </div>

      <div className="calendar-timeline">
        {/* Time markers */}
        {generateTimeMarkers()}

        {/* Current time indicator */}
        <div
          className="current-time-indicator"
          style={{ top: `${getCurrentTimePosition()}%` }}
        >
          <span className="current-time-label">
            {formatTime(currentTime)}
          </span>
        </div>

        {/* Class events */}
        {filteredClasses.map((classItem) => {
          const localStartTime = convertUTCToLocalTime(classItem.startTime, userTimezone);
          const localEndTime = convertUTCToLocalTime(classItem.endTime, userTimezone);
          const isCurrent = isCurrentTimeInRange(localStartTime, localEndTime);
          const position = getClassPosition(localStartTime, localEndTime);

          return (
            <Card
              key={classItem.id}
              className={`class-event ${isCurrent ? 'current-class' : ''}`}
              style={position}
              onClick={() => handleClassClick(classItem.classLink)}
            >
              <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                <Typography variant="h6" className="class-title">
                  {classItem.title}
                </Typography>
                <Typography variant="body2" className="class-time">
                  {formatTime(localStartTime)} - {formatTime(localEndTime)}
                </Typography>
                <Typography variant="body2" className="class-instructor">
                  Instructor: {classItem.instructor}
                </Typography>
                <Box mt={1}>
                  <Chip
                    label={classItem.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredClasses.length === 0 && (
        <div className="no-classes">
          <div className="no-classes-icon">📅</div>
          <Typography variant="h6" className="no-classes-text">
            No classes scheduled for today
          </Typography>
        </div>
      )}
    </Paper>
  );
};

export default calendar;