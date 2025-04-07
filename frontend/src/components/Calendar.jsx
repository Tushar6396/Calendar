import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addEvent, selectEvents, fetchEvents } from '../redux/calendarSlice';
import EventModal from './EventModal';

const hours = Array.from({ length: 24 }, (_, i) => i);
const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const Calendar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const events = useSelector(selectEvents);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEvents());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const currentHour = currentTime.getHours();
  const currentDay = days[(currentTime.getDay() + 6) % 7];
  const currentMinutes = currentTime.getMinutes();

  const handleCellClick = (day, hour) => {
    setSelectedSlot({ day, hour });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedSlot(null);
    setIsModalOpen(false);
  };

  const handleSaveEvent = (eventData) => {
    dispatch(addEvent(eventData));
    handleCloseModal();
  };

  return (
    <div className='p-20 overflow-x-auto'>
      <div className=' rounded-lg w-full border-l border-gray-200'>
        <div className='grid grid-cols-8 bg-gray-100'>
          <div className='p-2 text-sm font-bold border-r border-l border-gray-300'>
            Time
          </div>
          {days.map((day) => (
            <div
              key={day}
              className='p-2 text-center text-sm font-bold border-r border-gray-300'
            >
              {day}
            </div>
          ))}
        </div>

        {hours.map((hour) => (
          <div key={hour} className='grid grid-cols-8 border-t border-gray-200'>
            <div className='p-2 text-xs text-right pr-4 border-r border-gray-200 text-gray-500'>
              {hour.toString().padStart(2, '0')}:00
            </div>

            {days.map((day) => {
              const isCurrentCell = hour === currentHour && day === currentDay;
              const cellEvents = events.filter((event) => {
                if (!event || !event.date || !event.startTime) return false;
                const eventDate = new Date(event.date);
                const eventDay = days[(eventDate.getDay() + 6) % 7];
                return (
                  eventDay === day &&
                  parseInt(event.startTime.split(':')[0]) === hour
                );
              });

              return (
                <div
                  key={`${day}-${hour}`}
                  className='h-16 border-r border-gray-200 hover:bg-gray-100 cursor-pointer relative'
                  onClick={() => handleCellClick(day, hour)}
                >
                  {isCurrentCell && (
                    <div
                      className='absolute left-0 right-0 h-[2px] bg-red-500'
                      style={{ top: `${(currentMinutes / 60) * 100}%` }}
                    ></div>
                  )}

                  {cellEvents.map((event, index) => (
                    <div
                      key={index}
                      className='absolute top-1 left-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow'
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSlot(event);
                        setIsModalOpen(true);
                      }}
                    >
                      {event.startTime} <br />
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
          initialData={selectedSlot}
        />
      )}
    </div>
  );
};

export default Calendar;
