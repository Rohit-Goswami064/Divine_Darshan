import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AccessibleDatePickerProps {
    selectedDate: string; // YYYY-MM-DD
    onDateChange: (date: string) => void;
    minDate: string; // YYYY-MM-DD
}

const AccessibleDatePicker: React.FC<AccessibleDatePickerProps> = ({ selectedDate, onDateChange, minDate }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const initialDate = selectedDate ? new Date(selectedDate + 'T00:00:00') : today;
    const [currentDate, setCurrentDate] = useState(initialDate);
    const minDateObj = new Date(minDate + 'T00:00:00');

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    const calendarDays = useMemo(() => {
        const days = [];
        const startingDay = firstDayOfMonth.getDay();

        for (let i = 0; i < startingDay; i++) {
            days.push(null); // Padding for days of previous month
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
        }
        return days;
    }, [currentDate, firstDayOfMonth, daysInMonth]);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const isPrevMonthDisabled = currentDate.getFullYear() <= minDateObj.getFullYear() && currentDate.getMonth() <= minDateObj.getMonth();

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 border border-orange-200 w-full max-w-sm mx-auto">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={prevMonth}
                    disabled={isPrevMonthDisabled}
                    className="p-2 rounded-full hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous month"
                >
                    <ChevronLeft size={24} className="text-maroon" />
                </button>
                <div className="font-bold text-lg text-maroon">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </div>
                <button onClick={nextMonth} className="p-2 rounded-full hover:bg-orange-100" aria-label="Next month">
                    <ChevronRight size={24} className="text-maroon" />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {dayNames.map(day => (
                    <div key={day} className="font-semibold text-sm text-gray-500 py-2">{day}</div>
                ))}
                {calendarDays.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`} />;
                    
                    const dayString = day.toISOString().split('T')[0];
                    const isDisabled = day < minDateObj;
                    const isSelected = dayString === selectedDate;
                    const isToday = day.getTime() === today.getTime();

                    let buttonClasses = "w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors duration-200";
                    if (isDisabled) {
                        buttonClasses += " text-gray-300 cursor-not-allowed";
                    } else if (isSelected) {
                        buttonClasses += " bg-saffron text-white font-bold shadow-md";
                    } else if (isToday) {
                        buttonClasses += " bg-orange-100 text-maroon font-semibold";
                    } else {
                        buttonClasses += " text-gray-700 hover:bg-orange-100";
                    }

                    return (
                        <div key={dayString} className="flex justify-center items-center p-1">
                            <button
                                onClick={() => !isDisabled && onDateChange(dayString)}
                                disabled={isDisabled}
                                className={buttonClasses}
                                aria-label={`Select ${day.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
                                aria-pressed={isSelected}
                            >
                                {day.getDate()}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AccessibleDatePicker;
