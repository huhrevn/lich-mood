import React, { useMemo } from 'react';
import { getEventColor } from '../../../services/googleCalendarService';

interface CalendarEventListProps {
    events: any[];
    currentDate: Date;
    isSearching?: boolean;
    onEventClick?: (event: any) => void;
}

const CalendarEventList: React.FC<CalendarEventListProps> = ({ events, currentDate }) => {

    const { selectedDateEvents, upcomingEvents } = useMemo(() => {
        if (!events || events.length === 0) return { selectedDateEvents: [], upcomingEvents: [] };

        // Chuẩn hóa ngày đang chọn về buổi sáng để so sánh toDateString()
        const selectedDateStr = currentDate.toDateString();
        const now = new Date(); // Thời điểm hiện tại thực tế

        const selectedList: any[] = [];
        const upcomingList: any[] = [];

        events.forEach(evt => {
            // Hỗ trợ cả dữ liệu thô (object) và dữ liệu đã làm sạch (string)
            const startVal = evt.start?.dateTime || evt.start?.date || evt.start;
            if (!startVal) return;

            const evtDate = new Date(startVal);
            if (isNaN(evtDate.getTime())) return;

            // 1. Lọc sự kiện cho ngày đang chọn trên lịch
            if (evtDate.toDateString() === selectedDateStr) {
                selectedList.push(evt);
            }

            // 2. Lọc sự kiện "Sắp tới" (Lớn hơn thời điểm hiện tại & Không thuộc ngày đang chọn)
            else if (evtDate > now && upcomingList.length < 10) {
                upcomingList.push(evt);
            }
        });

        // Sắp xếp tăng dần theo thời gian
        const getEventTime = (e: any) => new Date(e.start?.dateTime || e.start?.date || e.start).getTime();
        selectedList.sort((a, b) => getEventTime(a) - getEventTime(b));
        upcomingList.sort((a, b) => getEventTime(a) - getEventTime(b));

        return { selectedDateEvents: selectedList, upcomingEvents: upcomingList };
    }, [events, currentDate]);

    // Hàm format giờ (Ví dụ: 09:30 hoặc "Cả ngày")
    const formatTime = (evt: any) => {
        // Nếu là string dạng YYYY-MM-DD thì là cả ngày
        const startVal = evt.start?.dateTime || evt.start?.date || evt.start;
        if (typeof startVal === 'string' && startVal.length === 10) return "Cả ngày";
        if (evt.start?.date) return "Cả ngày";

        try {
            return new Date(startVal).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return "---";
        }
    };

    return (
        <div className="flex flex-col gap-4 h-full overflow-y-auto no-scrollbar pr-1">

            {/* --- PHẦN 1: DANH SÁCH CỦA NGÀY ĐANG CHỌN --- */}
            <div>
                <h3 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green"></span>
                    Ngày {currentDate.getDate()} tháng {currentDate.getMonth() + 1}
                </h3>

                {selectedDateEvents.length > 0 ? (
                    <div className="flex flex-col gap-1.5">
                        {selectedDateEvents.map((evt, idx) => {
                            const eventColor = evt.backgroundColor || getEventColor(evt.colorId);
                            return (
                                <div
                                    key={idx}
                                    className="bg-white dark:bg-zinc-800 border-l-[3px] py-1.5 px-2.5 rounded-r-md shadow-sm border border-gray-100 dark:border-zinc-700 hover:bg-gray-50 transition-colors"
                                    style={{ borderLeftColor: eventColor }}
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <p className="font-bold text-gray-800 dark:text-gray-200 text-xs md:text-sm leading-tight truncate">{evt.summary || '(Không tiêu đề)'}</p>
                                        <div className="flex items-center gap-1">
                                            <span className="text-[10px] font-medium opacity-80" style={{ color: eventColor }}>
                                                {formatTime(evt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <p className="text-xs text-gray-400 italic">Không có sự kiện nào</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default CalendarEventList;