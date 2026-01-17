import React, { useMemo, useState } from 'react';
import lunisolar from 'lunisolar';
import { useEvents } from '../../../contexts/EventContext';
import { SOLAR_HOLIDAYS, LUNAR_HOLIDAYS } from '../../../constants/calendarConstants';
import { getEventColor } from '../../../services/googleCalendarService';

type EventType = 'HOLIDAY' | 'USER_EVENT';
type TabType = 'all' | 'holiday' | 'work' | 'personal';

interface UpcomingEvent {
    id: string;
    type: EventType;
    title: string;
    date: Date;
    lunarDateStr: string;
    tag?: string;
    description?: string;
    daysLeft: number;
    color?: string;
    isAllDay?: boolean;
}

const HomeUpcomingEvents: React.FC = () => {
    // Events are handled in ScheduleSheet now
    const [activeTab, setActiveTab] = useState<TabType>('all');

    const upcomingData = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const next90Days = new Date(today);
        next90Days.setDate(today.getDate() + 90);

        const results: UpcomingEvent[] = [];

        // 1. Calculate Holidays (Solar & Lunar)
        const currentYear = today.getFullYear();
        // Check this year and next year to cover crossover
        const yearsToCheck = [currentYear, currentYear + 1];

        yearsToCheck.forEach(year => {
            // Solar Holidays
            Object.entries(SOLAR_HOLIDAYS).forEach(([key, def]) => {
                const [d, m] = key.split('-').map(Number);
                const holidayDate = new Date(year, m - 1, d);

                if (holidayDate >= today && holidayDate <= next90Days) {
                    const daysLeft = Math.ceil((holidayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    try {
                        const lunar = lunisolar(holidayDate);
                        results.push({
                            id: `solar-${key}-${year}`,
                            type: 'HOLIDAY',
                            title: def.name,
                            date: holidayDate,
                            lunarDateStr: `${lunar.lunar.day}/${lunar.lunar.month} ÂL`,
                            tag: def.tag,
                            daysLeft: daysLeft,
                            color: '#ef4444' // Red for holidays
                        });
                    } catch (e) { }
                }
            });

            // Lunar Holidays
            Object.entries(LUNAR_HOLIDAYS).forEach(([key, def]) => {
                const [ld, lm] = key.split('-').map(Number);
                // Brute force scan roughly around likely solar dates or just convert important dates
                // A better approach for exactness without massive scanning:
                // Estimate solar date from lunar date? No, lunisolar lib works solar -> lunar.
                // We basically scan the next 90 days.
            });
        });

        // Optimization: Scan next 90 days ONE pass for Lunar matches to avoid year-logic complexity
        // This also handles solar dates correctly if we just matched them by DD/MM 
        // But we already did Solar above. Let's purely scan for Lunar here to be safe and simple.

        let scanDate = new Date(today);
        for (let i = 0; i < 90; i++) {
            try {
                const l = lunisolar(scanDate);
                const lunarKey = `${l.lunar.day}-${l.lunar.month}`;

                if (LUNAR_HOLIDAYS[lunarKey]) {
                    const def = LUNAR_HOLIDAYS[lunarKey];
                    // Avoid duplicates if a holiday is defined in both (rare, but possible if user customized)
                    // or if logic overlaps. 
                    // Distinct ID ensures unique key.

                    const daysLeft = i;
                    results.push({
                        id: `lunar-${lunarKey}-${scanDate.getTime()}`,
                        type: 'HOLIDAY',
                        title: def.name,
                        date: new Date(scanDate),
                        lunarDateStr: `${l.lunar.day}/${l.lunar.month} ÂL`,
                        tag: def.tag,
                        daysLeft: daysLeft,
                        color: '#ef4444' // Red
                    });
                }
            } catch (e) { }
            scanDate.setDate(scanDate.getDate() + 1);
        }

        // Sort by date
        return results.sort((a, b) => a.date.getTime() - b.date.getTime());
    }, []);

    const filteredEvents = useMemo(() => {
        if (activeTab === 'all') return upcomingData;
        if (activeTab === 'holiday') return upcomingData.filter(e => e.type === 'HOLIDAY');
        if (activeTab === 'work') return upcomingData.filter(e => e.type === 'USER_EVENT'); // Assuming all user events are 'work' or mixed for now
        if (activeTab === 'personal') return upcomingData.filter(e => e.type === 'USER_EVENT'); // Duplicate logic for now as we don't distinguish
        return upcomingData;
    }, [activeTab, upcomingData]);

    const getDayOfWeek = (date: Date) => {
        const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        return days[date.getDay()];
    };

    const [isExpanded, setIsExpanded] = useState(false);

    const displayEvents = useMemo(() => {
        if (isExpanded) return filteredEvents;
        return filteredEvents.slice(0, 5);
    }, [filteredEvents, isExpanded]);

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-[24px] shadow-card dark:shadow-none border border-gray-100 dark:border-zinc-800 flex flex-col h-full animate-[fadeIn_0.35s_ease-out]">
            {/* Header Tabs */}
            {/* Header Tabs - REMOVED since we only show holidays now */}

            {/* Title Row */}
            <div className="flex justify-between items-center px-4 pt-4 pb-2">
                <div className="flex items-center gap-2 text-blue-600">
                    <span className="material-symbols-outlined text-[20px]">campaign</span>
                    <span className="text-xs font-bold uppercase tracking-wider">Ngày Lễ & Sự Kiện</span>
                </div>
                <div className="flex items-center gap-2">
                    {filteredEvents.length > 5 && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center gap-0.5 text-[11px] font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-2 py-1 rounded transition-colors"
                        >
                            <span>{isExpanded ? 'Thu gọn' : 'Xem thêm'}</span>
                            <span className={`material-symbols-outlined text-[14px] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Event List */}
            <div className="flex-1 overflow-y-auto max-h-[400px] md:max-h-none p-4 pt-0 space-y-4 custom-scrollbar">
                {displayEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">event_busy</span>
                        <p className="text-xs font-medium">Không có sự kiện nào sắp tới</p>
                    </div>
                ) : (
                    <>
                        {displayEvents.map((evt) => (
                            <div key={evt.id} className="flex items-start gap-4 group">
                                {/* Date Box */}
                                <div className={`flex flex-col items-center justify-center size-14 rounded-2xl shrink-0 transition-colors ${evt.type === 'HOLIDAY' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'bg-gray-50 text-gray-600 dark:bg-zinc-800 dark:text-gray-300'}`}>
                                    <span className="text-lg font-extrabold leading-none">{evt.date.getDate()}</span>
                                    <span className="text-[10px] font-bold uppercase">{getDayOfWeek(evt.date)}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        {evt.tag && (
                                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-gray-400 tracking-wide">
                                                {evt.tag}
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="text-sm font-bold text-text-main truncate leading-tight mb-0.5" title={evt.title}>
                                        {evt.title}
                                    </h4>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                        {evt.lunarDateStr}
                                    </div>
                                </div>

                                {/* Countdown */}
                                <div className="flex flex-col items-end pt-1">
                                    {evt.daysLeft === 0 ? (
                                        <span className="text-[10px] font-bold text-red-500 uppercase bg-red-50 px-2 py-1 rounded-md">Hôm nay</span>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-0.5 text-blue-600">
                                                <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                                                <span className="text-lg font-bold leading-none">{evt.daysLeft}</span>
                                            </div>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase">Ngày nữa</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}


                    </>
                )}
            </div>
        </div>
    );
};

export default HomeUpcomingEvents;
