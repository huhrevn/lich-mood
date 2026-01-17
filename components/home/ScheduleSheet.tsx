
import React, { useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEvents } from '../../contexts/EventContext'; // Import hook
import { getEventColor } from '../../services/googleCalendarService';

const VARIED_COLORS = [
    '#4285F4', // Blue
    '#34A853', // Green
    '#EA4335', // Red
    '#FBBC05', // Yellow (Darker for readability)
    '#8E44AD', // Purple
    '#009688', // Teal
    '#F1C40F', // Sunflower
    '#E67E22', // Carrot
    '#E91E63', // Pink
    '#3F51B5'  // Indigo
];

const ScheduleSheet: React.FC = () => {
    const { t } = useLanguage();
    const { events } = useEvents(); // Lấy sự kiện từ context

    // Filter upcoming events (from today onwards)
    const upcomingEvents = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Start of today

        const filtered = events.filter(evt => {
            const startVal = evt.start?.dateTime || evt.start?.date || evt.start;
            if (!startVal) return false;
            const evtDate = new Date(startVal);
            return !isNaN(evtDate.getTime()) && evtDate >= now;
        });

        // Sort by time
        const getEventTime = (e: any) => new Date(e.start?.dateTime || e.start?.date || e.start).getTime();
        filtered.sort((a, b) => getEventTime(a) - getEventTime(b));

        return filtered.slice(0, 5); // Limit to 5 items
    }, [events]);

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    return (
        <section className="
            bg-bg-surface/90 dark:bg-zinc-900/90 backdrop-blur-xl 
            -mx-4 px-4 pt-2 pb-8 rounded-t-[32px] shadow-sheet border-t border-white/60 dark:border-zinc-800 
            mt-2 relative z-30 ring-1 ring-black/5 dark:ring-white/5 animate-[slideUp_0.5s_ease-out]
            
            md:mx-0 md:rounded-3xl md:shadow-card md:border md:border-gray-100 md:dark:border-zinc-800 md:bg-white md:dark:bg-zinc-900 md:mt-0 md:p-5 md:pt-5
        ">
            {/* Drag Handle (Mobile Only) */}
            <div className="w-full flex justify-center pt-3 pb-6 cursor-grab active:cursor-grabbing group md:hidden">
                <div className="w-16 h-1.5 bg-gray-300/80 dark:bg-zinc-600 rounded-full group-hover:bg-gray-400 transition-colors"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
                    {t('home.schedule')}
                    {upcomingEvents.length > 0 && (
                        <span className="flex items-center justify-center size-6 bg-accent-green text-white rounded-full text-[11px] font-bold shadow-sm">
                            {upcomingEvents.length}
                        </span>
                    )}
                </h2>
                <button className="text-accent-green text-xs font-bold uppercase hover:bg-accent-green/10 px-3 py-2 rounded-xl transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    {t('home.add_new')}
                </button>
            </div>

            {/* Timeline List */}
            <div className="flex flex-col gap-4">
                {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((evt, index) => {
                        const startVal = evt.start?.dateTime || evt.start?.date || evt.start;
                        const isAllDay = !!evt.start?.date; // Google Calendar convention: date exists = all day

                        const evtDate = new Date(startVal);
                        const now = new Date();
                        const isToday = isSameDay(evtDate, now);

                        const timeStr = isAllDay
                            ? 'Cả ngày'
                            : evtDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

                        const dateStr = evtDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

                        // Logic tạo màu ngẫu nhiên (theo index) để tạo điểm nhấn
                        // Nếu sự kiện có màu riêng (khác màu mặc định lịch) thì giữ, nếu không thì dùng bảng màu vui nhộn
                        const originalColor = evt.backgroundColor || getEventColor(evt.colorId);
                        // Tạm thời override bằng bảng màu theo index để đảm bảo độ rực rỡ như user yêu cầu
                        const eventColor = VARIED_COLORS[index % VARIED_COLORS.length];

                        // Map màu Google sang icon phù hợp (vẫn giữ logic icon cũ cho sinh động)
                        const icons = ['videocam', 'check_box', 'person', 'event', 'task', 'mail'];
                        const icon = icons[index % icons.length];

                        return (
                            <div key={evt.id || index} className="flex group">
                                <div className="flex flex-col items-end pr-3.5 w-[3.5rem] pt-1.5 shrink-0">
                                    {isToday ? (
                                        <>
                                            <span className="text-sm font-bold text-text-main">{timeStr}</span>
                                            <span className="text-[10px] text-accent-green font-bold tracking-wide">HÔM NAY</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-sm font-bold text-gray-500">{dateStr}</span>
                                            <span className="text-[10px] text-gray-400 font-bold tracking-wide">{timeStr}</span>
                                        </>
                                    )}
                                </div>
                                <div
                                    className={`flex-1 relative pl-4 py-3 border-l-[3px] bg-white dark:bg-zinc-800 rounded-r-2xl shadow-soft flex flex-col gap-1 ring-1 ring-gray-100/80 dark:ring-zinc-700/50 hover:ring-opacity-50 transition-all`}
                                    style={{ borderLeftColor: eventColor }}
                                >
                                    <h4 className="text-sm font-bold text-text-main line-clamp-1">{evt.summary}</h4>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`material-symbols-outlined text-[14px]`} style={{ color: eventColor }}>{icon}</span>
                                        <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium line-clamp-1">
                                            {evt.description || (isToday ? 'Sự kiện hôm nay' : 'Sự kiện sắp tới')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-6">
                        <p className="text-sm text-gray-400 italic">Không có sự kiện sắp tới</p>
                    </div>
                )}
            </div>     {/* Tomorrow Separator (Nếu cần logic phức tạp hơn thì thêm sau, tạm thời ẩn nếu ko có data) */}
            {/* ... */}
        </section>
    );
};

export default React.memo(ScheduleSheet);
