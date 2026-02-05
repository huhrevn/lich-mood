import React, { useMemo } from 'react';
import lunisolar from 'lunisolar';
import { getEventColor } from '../../../services/googleCalendarService';

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
    events?: any[];
    onDateDoubleClick?: (date: Date) => void;
    onEventClick?: (event: any) => void;
    onAddEventClick?: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ date, onDateChange, onTogglePicker, events = [], onDateDoubleClick, onEventClick, onAddEventClick }) => {

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
                } catch (e) { }
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
        if (onAddEventClick) {
            onAddEventClick(dayDate);
        }
    };

    const monthString = `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;

    // --- NAVIGATION LOGIC: SCROLL & SWIPE ---
    const touchStartX = React.useRef<number | null>(null);
    const touchEndX = React.useRef<number | null>(null);
    const lastScrollTime = React.useRef<number>(0);

    const onWheel = (e: React.WheelEvent) => {
        // Prevent default page scroll if needed, but here we just handle logic
        // Debounce scroll to prevent rapid month switching
        const now = Date.now();
        if (now - lastScrollTime.current < 300) return;

        lastScrollTime.current = now;

        // User Logic: "cuộn lên thì tháng lên" (Scroll Up/Negative -> Month Up/Next)
        // "cuộn xuống thì tháng xuống" (Scroll Down/Positive -> Month Down/Prev)
        if (e.deltaY < 0) {
            handleNextMonth();
        } else if (e.deltaY > 0) {
            handlePrevMonth();
        }
    };

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;

        const diffX = touchStartX.current - touchEndX.current;
        const threshold = 50; // Minimum swipe distance

        if (Math.abs(diffX) > threshold) {
            // User Logic: 
            // "vuốt quá trái thì tháng giảm" (Swipe Left / Drag Left -> Decrease / Prev)
            // dragging left means startX > endX -> diffX > 0

            // "vuốt qua phải tháng tăng" (Swipe Right / Drag Right -> Increase / Next)
            // dragging right means startX < endX -> diffX < 0

            if (diffX > 0) {
                // Swipe Left
                handlePrevMonth();
            } else {
                // Swipe Right
                handleNextMonth();
            }
        }

        touchStartX.current = null;
        touchEndX.current = null;
    };

    return (
        <div
            className="calendar-main-grid w-full select-none h-full flex flex-col font-display overflow-visible flex-1"
            onWheel={onWheel}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Header: Larger for Page */}
            {/* Header: Centered Layout with Side Nav */}
            <div className="relative flex items-center justify-center mb-2 md:mb-6 pt-2 px-4 md:px-8 min-h-[40px] md:min-h-[48px]">
                {/* PREV BTN (Left) */}
                <button
                    onClick={handlePrevMonth}
                    className="absolute left-4 md:left-8 size-8 md:size-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-500 dark:text-gray-400 transition-all shadow-sm z-10"
                >
                    <span className="material-symbols-outlined text-[20px] md:text-[24px]">chevron_left</span>
                </button>

                {/* CENTER GROUP */}
                <div className="flex items-center gap-3 md:gap-4 z-0">
                    <div
                        className="flex items-center gap-1.5 md:gap-2 cursor-pointer group select-none"
                        onClick={onTogglePicker}
                    >
                        <span className="material-symbols-outlined text-base md:text-2xl text-accent-green">calendar_month</span>
                        <h2 className="text-base md:text-3xl lg:text-2xl 2xl:text-3xl font-bold text-text-main tracking-tight group-hover:text-accent-green transition-colors">
                            {monthString}
                        </h2>
                        <span className="material-symbols-outlined text-gray-400 group-hover:text-accent-green transition-colors text-base md:text-2xl">expand_more</span>
                    </div>

                    <button
                        onClick={handleToday}
                        className="px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-all uppercase tracking-wide"
                    >
                        Hôm nay
                    </button>
                </div>

                {/* NEXT BTN (Right) */}
                <button
                    onClick={handleNextMonth}
                    className="absolute right-4 md:right-8 size-8 md:size-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-500 dark:text-gray-400 transition-all shadow-sm z-10"
                >
                    <span className="material-symbols-outlined text-[20px] md:text-[24px]">chevron_right</span>
                </button>
            </div>

            {/* Weekday Headers - Added background and border */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => (
                    <div key={day} className={`text-center py-2 text-[11px] md:text-xs font-bold uppercase tracking-wider
                        ${index < 6 ? 'border-r border-gray-200 dark:border-zinc-700' : ''}
                        ${day === 'CN' ? 'text-red-600' :
                            day === 'T7' ? 'text-orange-600' :
                                'text-gray-500 dark:text-gray-400'
                        }
                    `}>
                        {day}
                    </div>
                ))}
            </div>

            {/* CALENDAR GRID STYLES - Classic Grid Look */}
            <div className="grid grid-cols-7 border-l border-gray-200 dark:border-zinc-700">
                {emptySlots.map((_, index) => (
                    <div key={`empty-${index}`} className="min-h-[65px] md:min-h-[120px] border-r border-b border-gray-200 dark:border-zinc-700 bg-gray-50/30" />
                ))}

                {days.map((dayInfo) => {
                    const isSelected = dayInfo.date.getDate() === date.getDate() &&
                        dayInfo.date.getMonth() === date.getMonth();

                    const isSunday = dayInfo.dayOfWeek === 0;
                    const isSaturday = dayInfo.dayOfWeek === 6;

                    // --- 2. LỌC SỰ KIỆN CỦA NGÀY NÀY ---
                    const dayEvents = events?.filter(event => {
                        const startVal = event.start?.dateTime || event.start?.date || event.start;
                        if (!startVal) return false;
                        const eventDate = new Date(startVal);
                        return !isNaN(eventDate.getTime()) && eventDate.toDateString() === dayInfo.date.toDateString();
                    });
                    const hasEvent = dayEvents && dayEvents.length > 0;
                    // ------------------------------------

                    const isLunarNewYear = dayInfo.lunarMonth === 1 && (dayInfo.lunarDay === 1 || dayInfo.lunarDay === 2 || dayInfo.lunarDay === 3);

                    return (
                        <div
                            key={dayInfo.day}
                            onClick={() => handleDateClick(dayInfo.date)}
                            onDoubleClick={() => onDateDoubleClick && onDateDoubleClick(dayInfo.date)}
                            className={`relative min-h-[65px] md:min-h-[120px] cursor-pointer transition-colors group overflow-hidden border-r border-b border-gray-200 dark:border-zinc-700
                                ${isSelected
                                    ? 'bg-blue-50 dark:bg-blue-900/20'
                                    : 'bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                }
                            `}
                        >
                            {/* --- HEADER: Date Numbers (Solar centered, Lunar below) --- */}
                            <div className="flex flex-col items-center justify-center pt-2 md:pt-3">
                                {/* Solar Date */}
                                {dayInfo.isToday ? (
                                    <div className="size-6 md:size-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] md:text-base font-bold shadow-md mb-0.5 scale-110">
                                        {dayInfo.day}
                                    </div>
                                ) : (
                                    <span className={`text-[12px] md:text-[19px] font-extrabold leading-tight mb-0.5
                                        ${isLunarNewYear || isSunday ? 'text-red-600' : isSaturday ? 'text-orange-600' : 'text-gray-900 dark:text-gray-100'}
                                    `}>
                                        {dayInfo.day}
                                    </span>
                                )}

                                {/* Lunar Date (Directly below Solar) */}
                                <div className={`flex flex-col items-center text-[8px] md:text-[10px] font-medium leading-tight translate-x-2 md:translate-x-4
                                    ${isLunarNewYear || dayInfo.lunarDay === 1 || dayInfo.lunarDay === 15 ? 'text-red-600 font-bold' : 'text-gray-400 dark:text-gray-500'}
                                `}>
                                    <div>{dayInfo.lunarDay === 1 ? `${dayInfo.lunarDay}/${dayInfo.lunarMonth}` : dayInfo.lunarDay}</div>
                                    {isLunarNewYear && (
                                        <div className="text-[7px] md:text-[9px] font-bold text-red-600 mt-0.5 whitespace-nowrap -translate-x-2 md:-translate-x-4">Tết Nguyên Đán</div>
                                    )}
                                </div>
                            </div>

                            {/* --- MOBILE: Dots (< md) --- */}
                            <div className="md:hidden absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                {dayEvents?.slice(0, 3).map((evt: any, idx) => (
                                    <div key={idx}
                                        className="size-1 rounded-full"
                                        style={{ backgroundColor: evt.backgroundColor || getEventColor(evt.colorId) }}
                                    ></div>
                                ))}
                            </div>

                            {/* --- DESKTOP: Event Bars (>= md) --- */}
                            <div className="hidden md:flex flex-col gap-1 px-1 mt-1 w-full mb-1 flex-1">
                                {dayEvents?.slice(0, 4).map((evt: any, idx: number) => {
                                    // Logic chọn màu: Ưu tiên màu background trực tiếp (mặc định của lịch), sau đó mới đến colorId
                                    const bgColor = evt.backgroundColor || getEventColor(evt.colorId);

                                    // STYLE 1: ALL DAY EVENT (Filled Bar)
                                    if (evt.isAllDay) {
                                        return (
                                            <div
                                                key={evt.id || idx}
                                                onClick={(e) => { e.stopPropagation(); onEventClick && onEventClick(evt); }}
                                                className="px-1.5 py-0.5 rounded-[3px] text-[11px] font-medium text-white truncate shadow-sm hover:opacity-90 transition-opacity leading-tight"
                                                style={{ backgroundColor: bgColor }}
                                                title={evt.summary}
                                            >
                                                {evt.summary}
                                            </div>
                                        );
                                    }

                                    // STYLE 2: TIMED EVENT (Dot + Text)
                                    const startVal = evt.start?.dateTime || evt.start?.date || evt.start;
                                    const eventTime = new Date(startVal).toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    });

                                    return (
                                        <div
                                            key={evt.id || idx}
                                            onClick={(e) => { e.stopPropagation(); onEventClick && onEventClick(evt); }}
                                            className="flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] hover:brightness-95 transition-all cursor-pointer truncate mb-0.5 group/evt shadow-sm border border-transparent hover:border-black/5"
                                            style={{ backgroundColor: `${bgColor}15` }} // Light background (15% opacity)
                                            title={`${eventTime} ${evt.summary}`}
                                        >
                                            <div className="size-1.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: bgColor }}></div>
                                            <div className="flex items-center gap-1 text-[10px] md:text-[11px] font-semibold text-text-main truncate">
                                                <span className="text-gray-600 dark:text-gray-400 tabular-nums shrink-0">{eventTime}</span>
                                                <span className="truncate group-hover/evt:underline decoration-offset-2">{evt.summary}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                                {/* More indicator */}
                                {dayEvents && dayEvents.length > 4 && (
                                    <div className="text-[10px] text-gray-500 font-medium pl-2 hover:text-text-main cursor-pointer">
                                        {dayEvents.length - 4} thêm...
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarGrid;