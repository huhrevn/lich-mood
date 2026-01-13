import React, { useMemo } from 'react';
import lunisolar from 'lunisolar';

interface DayInfo {
    date: Date;
    day: number;
    lunarDay: number;
    lunarMonth: number;
    isToday: boolean;
    dayOfWeek: number;
}

interface CalendarGridProps {
    date: Date;
    onDateChange: (newDate: Date) => void;
    onTogglePicker?: () => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ date, onDateChange, onTogglePicker }) => {
    
    const { days, emptySlots } = useMemo(() => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const today = new Date();

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1);
        const jsDay = firstDayOfMonth.getDay();
        const startDayOfWeek = (jsDay + 6) % 7; 

        const generatedDays: DayInfo[] = [];
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(year, month, i);
            let lunarDay = 1, lunarMonth = 1;

            if (year >= 1900 && year <= 2100) {
                try {
                    const lunarData = lunisolar(currentDate);
                    lunarDay = lunarData.lunar.day;
                    lunarMonth = lunarData.lunar.month;
                } catch (e) {}
            }

            generatedDays.push({
                date: currentDate,
                day: i,
                lunarDay: lunarDay,
                lunarMonth: lunarMonth,
                isToday: currentDate.getDate() === today.getDate() &&
                         currentDate.getMonth() === today.getMonth() &&
                         currentDate.getFullYear() === today.getFullYear(),
                dayOfWeek: currentDate.getDay()
            });
        }

        return {
            days: generatedDays,
            emptySlots: Array.from({ length: startDayOfWeek })
        };
    }, [date]);

    const handlePrevMonth = () => {
        const newDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        onDateChange(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        onDateChange(newDate);
    };

    const handleToday = () => {
        onDateChange(new Date());
    };

    const handleDateClick = (dayDate: Date) => {
        onDateChange(new Date(dayDate));
    };

    const monthString = `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;

    return (
        <div className="calendar-main-grid w-full select-none h-auto flex flex-col font-display overflow-visible">
            {/* Header: Larger for Page */}
            <div className="flex items-center justify-between mb-2 md:mb-8 lg:mb-4 2xl:mb-8 pt-1 md:pt-2 px-1 md:px-2">
                <div 
                    className="flex items-center gap-1.5 md:gap-2 cursor-pointer group"
                    onClick={onTogglePicker}
                >
                    <span className="material-symbols-outlined text-lg md:text-2xl text-accent-green">calendar_month</span>
                    <h2 className="text-lg md:text-3xl lg:text-2xl 2xl:text-3xl font-bold text-text-main tracking-tight group-hover:text-accent-green transition-colors">
                        {monthString}
                    </h2>
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-accent-green transition-colors text-lg md:text-2xl">expand_more</span>
                </div>
                
                <div className="flex items-center gap-2 md:gap-3">
                    <button 
                        onClick={handleToday} 
                        className="px-2 py-1 md:px-4 md:py-2 text-[10px] md:text-xs font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all uppercase"
                    >
                        Hôm nay
                    </button>
                    <div className="flex items-center gap-1 bg-gray-50 dark:bg-zinc-800 rounded-lg p-0.5 md:p-1 border border-gray-200 dark:border-zinc-700">
                        <button onClick={handlePrevMonth} className="size-7 md:size-8 flex items-center justify-center rounded-md hover:bg-white text-gray-500 transition-all shadow-sm">
                            <span className="material-symbols-outlined text-[18px] md:text-[20px]">chevron_left</span>
                        </button>
                        <button onClick={handleNextMonth} className="size-7 md:size-8 flex items-center justify-center rounded-md hover:bg-white text-gray-500 transition-all shadow-sm">
                            <span className="material-symbols-outlined text-[18px] md:text-[20px]">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-1 md:mb-4 lg:mb-2 2xl:mb-4 border-b border-gray-100 dark:border-zinc-800 pb-1 md:pb-4 lg:pb-2 2xl:pb-4">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
                    <div key={day} className={`text-center text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-widest
                        ${day === 'CN' ? 'text-red-500' : 
                          day === 'T7' ? 'text-orange-500' : 
                          'text-gray-400 dark:text-gray-500'
                        }
                    `}>
                        {day}
                    </div>
                ))}
            </div>

            {/* CALENDAR GRID STYLES */}
            <div className="grid grid-cols-7 gap-1 md:gap-3 lg:gap-3 2xl:gap-6 items-start content-start">
                {emptySlots.map((_, index) => (
                    <div key={`empty-${index}`} className="h-[54px] md:h-[90px] lg:h-auto lg:aspect-[1.45/1] 2xl:h-[70px] 2xl:aspect-auto" />
                ))}

                {days.map((dayInfo) => {
                    const isSelected = dayInfo.date.getDate() === date.getDate() && 
                                       dayInfo.date.getMonth() === date.getMonth();
                    
                    const isSunday = dayInfo.dayOfWeek === 0;
                    const isSaturday = dayInfo.dayOfWeek === 6;

                    return (
                        <div 
                            key={dayInfo.day} 
                            onClick={() => handleDateClick(dayInfo.date)}
                            className={`relative h-[54px] md:h-[90px] lg:h-auto lg:aspect-[1.45/1] 2xl:h-[70px] 2xl:aspect-auto rounded-lg md:rounded-2xl lg:rounded-xl cursor-pointer transition-all duration-300 group overflow-hidden border border-transparent
                                ${isSelected 
                                    ? 'bg-[#4A7B4F] shadow-lg shadow-green-900/20 z-10 scale-[1.02]' 
                                    : 'hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:border-gray-100'
                                }
                            `}
                        >
                            {/* Today Dot */}
                            {dayInfo.isToday && !isSelected && (
                                <div className="absolute top-1 right-1 md:top-3 md:right-3 lg:top-2 lg:right-2 size-1 md:size-2 bg-amber-400 rounded-full"></div>
                            )}

                            {/* Solar Day */}
                            <span className={`absolute transition-all font-semibold md:font-bold leading-none
                                ${isSelected 
                                    ? 'top-1 right-1 md:top-3 md:right-4 lg:top-1.5 lg:right-2.5 2xl:top-1.5 2xl:right-2 text-sm md:text-3xl lg:text-xl 2xl:text-xl text-white' 
                                    : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-full text-base md:text-xl lg:text-xl 2xl:text-xl text-gray-700 dark:text-gray-200'
                                }
                                ${!isSelected && isSunday ? 'text-red-500' : ''}
                                ${!isSelected && isSaturday ? 'text-orange-500' : ''}
                            `}>
                                {dayInfo.day}
                            </span>

                            {/* Lunar Day */}
                            <span className={`absolute transition-all font-medium leading-none tabular-nums
                                ${isSelected 
                                    ? 'bottom-1 left-1 md:bottom-3 md:left-4 lg:bottom-1.5 lg:left-2.5 2xl:bottom-1.5 2xl:left-2 text-[8px] md:text-sm lg:text-[10px] 2xl:text-[10px] text-white/80' 
                                    : 'top-1/2 left-1/2 -translate-x-1/2 translate-y-1.5 md:translate-y-1 lg:translate-y-1 text-[8px] md:text-[10px] lg:text-[11px] 2xl:text-[10px] text-gray-400 dark:text-gray-500'
                                }
                                ${!isSelected && (dayInfo.lunarDay === 1 || dayInfo.lunarDay === 15) ? 'text-primary font-bold' : ''}
                            `}>
                                {dayInfo.lunarDay === 1 ? `${dayInfo.lunarDay}/${dayInfo.lunarMonth}` : dayInfo.lunarDay}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarGrid;