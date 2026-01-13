
import React, { useState } from 'react';
import { CalendarEvent } from '../../types/calendarTypes';

interface CalendarEventListProps {
    events: CalendarEvent[];
    currentDate: Date;
    isSearching: boolean;
    onEventClick: (event: CalendarEvent) => void;
}

const CalendarEventList: React.FC<CalendarEventListProps> = ({ events, currentDate, isSearching, onEventClick }) => {
    const [filter, setFilter] = useState('all');

    const FILTERS = [
        { id: 'all', label: 'Tất cả', color: 'bg-accent-green text-white dark:bg-accent-green dark:text-white' },
        { id: 'holiday', label: 'Lễ hội', color: 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30' },
        { id: 'work', label: 'Công việc', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30' },
        { id: 'personal', label: 'Cá nhân', color: 'bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-300 dark:hover:bg-orange-900/30' }
    ];

    // Filter Logic
    const filteredEvents = events.filter(e => {
        if (filter === 'all') return true;
        if (filter === 'holiday') return ['Quốc lễ', 'Tết', 'Lễ hội'].includes(e.tag);
        return true; 
    });

    return (
        <div className="flex flex-col h-full min-w-0">
            {/* Chips */}
            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                {FILTERS.map(chip => (
                    <button
                        key={chip.id}
                        onClick={() => setFilter(chip.id)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all shrink-0 border border-transparent ${
                            filter === chip.id 
                            ? `${chip.color} shadow-sm border-transparent` 
                            : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-700'
                        }`}
                    >
                        {chip.label}
                    </button>
                ))}
            </div>

            {/* Header */}
            <div className="flex items-center gap-2 mb-3 text-accent-green">
                <span className="material-symbols-outlined text-[18px]">forest</span>
                <span className="text-xs font-bold uppercase tracking-widest">Sự kiện & Lễ hội</span>
                <span className="ml-auto text-[10px] text-gray-400 dark:text-zinc-500 whitespace-nowrap">3 tháng tới</span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[300px] custom-scrollbar">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => onEventClick(event)}
                            className="group flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-zinc-800/40 hover:bg-gray-50 dark:hover:bg-zinc-800 border border-transparent dark:border-zinc-800 hover:border-gray-100 dark:hover:border-zinc-700 transition-all cursor-pointer shadow-sm hover:shadow-md"
                        >
                            {/* Date Block */}
                            <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl shrink-0 ${
                                event.type === 'SOLAR' 
                                ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' 
                                : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                            }`}>
                                <span className="text-lg font-bold leading-none">{event.date.getDate()}</span>
                                <span className="text-[9px] font-bold uppercase">T{event.date.getMonth() + 1}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] px-1.5 py-0.5 rounded border border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-700/50 text-gray-500 dark:text-zinc-400 font-bold uppercase truncate">
                                            {event.tag}
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-bold text-text-main dark:text-zinc-100 group-hover:text-accent-green transition-colors truncate">
                                        {event.title}
                                    </h4>
                                    <span className="text-[10px] text-gray-400 dark:text-zinc-500 truncate">{event.lunarDateStr}</span>
                                </div>

                                {/* Countdown - Moved to Right & Highlighted */}
                                <div className="shrink-0 text-right pl-2">
                                    {event.daysLeft > 0 ? (
                                        <div className="flex flex-col items-end">
                                            <span className="text-xl font-bold text-accent-green leading-none tabular-nums tracking-tight">
                                                {event.daysLeft}
                                            </span>
                                            <span className="text-[9px] font-bold text-accent-green/80 uppercase tracking-wide">
                                                ngày nữa
                                            </span>
                                        </div>
                                    ) : event.daysLeft === 0 ? (
                                        <span className="text-[10px] font-bold text-accent-gold uppercase bg-accent-gold/10 px-2 py-1 rounded-lg">Hôm nay</span>
                                    ) : (
                                        <span className="text-[10px] font-bold text-gray-300 uppercase">Đã qua</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 opacity-50">
                        <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-zinc-600 mb-2">event_busy</span>
                        <p className="text-xs font-medium text-gray-400 dark:text-zinc-500">Không có sự kiện</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarEventList;
