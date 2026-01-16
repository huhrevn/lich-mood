
import React, { useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEvents } from '../../contexts/EventContext'; // Import hook
import { getEventColor } from '../../services/googleCalendarService';

const ScheduleSheet: React.FC = () => {
    const { t } = useLanguage();
    const { events } = useEvents(); // Lấy sự kiện từ context

    // Lọc và lấy các sự kiện của NGÀY HÔM NAY
    const todayEvents = useMemo(() => {
        const now = new Date();
        const todayStr = now.toDateString();

        const filtered = events.filter(evt => {
            const startVal = evt.start?.dateTime || evt.start?.date || evt.start;
            if (!startVal) return false;
            const evtDate = new Date(startVal);
            return !isNaN(evtDate.getTime()) && evtDate.toDateString() === todayStr;
        });

        // Sắp xếp tăng dần theo thời gian
        const getEventTime = (e: any) => new Date(e.start?.dateTime || e.start?.date || e.start).getTime();
        filtered.sort((a, b) => getEventTime(a) - getEventTime(b));

        return filtered;
    }, [events]);

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
                    {todayEvents.length > 0 && (
                        <span className="flex items-center justify-center size-6 bg-accent-green text-white rounded-full text-[11px] font-bold shadow-sm">
                            {todayEvents.length}
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
                {todayEvents.length > 0 ? (
                    todayEvents.map((evt, index) => {
                        const startVal = evt.start?.dateTime || evt.start?.date || evt.start;
                        const evtDate = new Date(startVal);
                        const isAm = evtDate.getHours() < 12;
                        const timeStr = evtDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

                        const eventColor = getEventColor(evt.colorId);
                        // Map màu Google sang icon phù hợp (vẫn giữ logic icon cũ cho sinh động)
                        const icons = ['videocam', 'check_box', 'person', 'event', 'task', 'mail'];
                        const icon = icons[index % icons.length];

                        return (
                            <div key={evt.id || index} className="flex group">
                                <div className="flex flex-col items-end pr-3.5 w-[3.5rem] pt-1.5">
                                    <span className="text-sm font-bold text-text-main">{timeStr}</span>
                                    <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold tracking-wide">{isAm ? 'AM' : 'PM'}</span>
                                </div>
                                <div
                                    className={`flex-1 relative pl-4 py-3 border-l-[3px] bg-white dark:bg-zinc-800 rounded-r-2xl shadow-soft flex flex-col gap-1 ring-1 ring-gray-100/80 dark:ring-zinc-700/50 hover:ring-opacity-50 transition-all`}
                                    style={{ borderLeftColor: eventColor }}
                                >
                                    <h4 className="text-sm font-bold text-text-main line-clamp-1">{evt.summary}</h4>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`material-symbols-outlined text-[14px]`} style={{ color: eventColor }}>{icon}</span>
                                        <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium line-clamp-1">
                                            {evt.description || 'Google Calendar'}
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

                {/* Tomorrow Separator (Nếu cần logic phức tạp hơn thì thêm sau, tạm thời ẩn nếu ko có data) */}
                {/* ... */}
            </div>
        </section>
    );
};

export default React.memo(ScheduleSheet);
