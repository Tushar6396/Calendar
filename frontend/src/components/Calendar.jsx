import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addEvent,
  selectEvents,
  fetchEvents,
  updateEventAsync,
} from '../redux/calendarSlice';
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

const categoryColors = {
  exercise: 'bg-yellow-100',
  eating: 'bg-pink-100',
  work: 'bg-red-100',
  relax: 'bg-purple-100',
  family: 'bg-green-100',
  social: 'bg-blue-100',
};

const categoryTextColors = {
  exercise: 'text-yellow-900',
  eating: 'text-pink-900',
  work: 'text-red-900',
  relax: 'text-purple-900',
  family: 'text-green-900',
  social: 'text-blue-900',
};

const categoryBorderColors = {
  exercise: 'border-yellow-300',
  eating: 'border-pink-300',
  work: 'border-red-300',
  relax: 'border-purple-300',
  family: 'border-green-300',
  social: 'border-blue-300',
};

const Calendar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weekStartDate, setWeekStartDate] = useState(null);

  const events = useSelector(selectEvents);
  const dispatch = useDispatch();

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    setWeekStartDate(monday);
  }, []);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

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

  const handleDragStart = (e, event) => {
    e.dataTransfer.setData('eventId', event._id);
  };

  const handleDrop = (e, targetDay, targetHour) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData('eventId');
    const event = events.find((ev) => ev._id === eventId);
    if (!eventId || !event || !weekStartDate) return;

    const targetDayIndex = days.indexOf(targetDay);

    const targetDate = new Date(weekStartDate.getTime());
    targetDate.setDate(weekStartDate.getDate() + targetDayIndex);

    const formattedDate = targetDate.toISOString().split('T')[0];
    const formattedTime = `${String(targetHour).padStart(2, '0')}:00`;

    const updatedEvent = {
      ...event,
      date: formattedDate,
      startTime: formattedTime,
    };

    // console.log(`Dropped on ${targetDay} ${targetHour}:00`);
    // console.log('Mapped to date:', formattedDate);

    // console.log('Week Start Date:', weekStartDate.toDateString());
    // console.log('Target Date:', targetDate.toDateString());

    dispatch(updateEventAsync({ id: eventId, updatedData: updatedEvent }));
  };

  return (
    <div className='px-10 py-10 overflow-x-auto'>
      <h2 className='text-center top-0 mb-4 text-3xl font-bold'>
        Weekly View Calender
      </h2>
      <div className=' rounded-lg w-full border-l border-gray-200'>
        <div className='grid grid-cols-8 bg-gray-100'>
          <div className='p-2 text-sm font-bold border-r border-l border-gray-300'>
            Time
          </div>
          {weekStartDate &&
            days.map((day, index) => {
              const date = new Date(weekStartDate);
              date.setDate(weekStartDate.getDate() + index);
              const formattedDate = date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
              });

              return (
                <div
                  key={day}
                  className='p-2 text-center text-sm font-semibold border-r border-gray-300'
                >
                  <div>{day}</div>
                  <div className='text-xl font-bold text-gray-900'>
                    {formattedDate}
                  </div>
                </div>
              );
            })}
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
                const eventDayIndex = (new Date(event.date).getDay() + 6) % 7;
                return (
                  eventDayIndex === days.indexOf(day) &&
                  parseInt(event.startTime.split(':')[0]) === hour
                );
              });

              return (
                <div
                  key={`${day}-${hour}`}
                  className='h-16 border-r border-gray-200 hover:bg-gray-100 cursor-pointer relative'
                  onClick={() => handleCellClick(day, hour)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, day, hour)}
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
                      draggable
                      className={`absolute w-full h-full ${
                        categoryColors[event.category] || 'bg-gray-400'
                      } ${
                        categoryTextColors[event.category] || 'text-gray-800'
                      } text-sm font-medium px-2 rounded shadow border-l-4 ${
                        categoryBorderColors[event.category] ||
                        'border-gray-800'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSlot(event);
                        setIsModalOpen(true);
                      }}
                      onDragStart={(e) => handleDragStart(e, event)}
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
