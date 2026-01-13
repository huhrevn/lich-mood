import React, { useMemo } from 'react';

interface CalendarEventListProps {
    events: any[];
    currentDate: Date;
    isSearching?: boolean;
    onEventClick?: (event: any) => void;
}

const CalendarEventList: React.FC<CalendarEventListProps> = ({ events, currentDate }) => {
    
    const { selectedDateEvents, upcomingEvents } = useMemo(() => {
        if (!events || events.length === 0) return { selectedDateEvents: [], upcomingEvents: [] };

        // Chuẩn hóa ngày đang chọn về 0h00 để so sánh
        const selectedDateStr = currentDate.toDateString(); 
        const now = new Date(); // Thời điểm hiện tại thực tế

        const selectedList: any[] = [];
        const upcomingList: any[] = [];

        events.forEach(evt => {
            // Google Calendar trả về 2 dạng: dateTime (có giờ) hoặc date (cả ngày)
            const startStr = evt.start.dateTime || evt.start.date;
            const evtDate = new Date(startStr);
            
            // 1. Lọc sự kiện cho ngày đang chọn trên lịch
            if (evtDate.toDateString() === selectedDateStr) {
                selectedList.push(evt);
            } 
            
            // 2. Lọc sự kiện "Sắp tới" (Lớn hơn thời điểm hiện tại & Không thuộc ngày đang chọn)
            // Chỉ lấy sự kiện tương lai thực sự
            else if (evtDate > now && upcomingList.length < 10) {
                upcomingList.push(evt);
            }
        });

        // Sắp xếp tăng dần theo thời gian
        selectedList.sort((a, b) => new Date(a.start.dateTime || a.start.date).getTime() - new Date(b.start.dateTime || b.start.date).getTime());
        // Sắp tới thì sắp xếp cái nào gần nhất hiện trước
        upcomingList.sort((a, b) => new Date(a.start.dateTime || a.start.date).getTime() - new Date(b.start.dateTime || b.start.date).getTime());

        return { selectedDateEvents: selectedList, upcomingEvents: upcomingList };
    }, [events, currentDate]);

    // Hàm format giờ (Ví dụ: 09:30 hoặc "Cả ngày")
    const formatTime = (evt: any) => {
        if (evt.start.date) return "Cả ngày";
        return new Date(evt.start.dateTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
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
                    <div className="flex flex-col gap-2">
                        {selectedDateEvents.map((evt, idx) => (
                            <div key={idx} className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-2 md:p-3 rounded-r-lg shadow-sm">
                                <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{evt.summary || '(Không tiêu đề)'}</p>
                                <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                                    🕒 {formatTime(evt)}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <p className="text-xs text-gray-400 italic">Không có sự kiện nào</p>
                    </div>
                )}
            </div>

            {/* --- PHẦN 2: SỰ KIỆN SẮP TỚI (UPCOMING) --- */}
            {upcomingEvents.length > 0 && (
                <div className="mt-2 pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <h3 className="text-[10px] md:text-xs font-bold text-orange-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">event_upcoming</span>
                        Sắp diễn ra
                    </h3>
                    <div className="flex flex-col gap-2">
                        {upcomingEvents.map((evt, idx) => {
                            const d = new Date(evt.start.dateTime || evt.start.date);
                            // Tính xem còn bao nhiêu ngày nữa
                            const diffTime = Math.abs(d.getTime() - new Date().getTime());
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

                            return (
                                <div key={idx} className="flex gap-3 items-center p-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-zinc-700">
                                    {/* Hộp ngày tháng nhỏ */}
                                    <div className="flex flex-col items-center justify-center w-10 h-10 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shrink-0 shadow-sm">
                                        <span className="text-[9px] font-bold text-red-500 uppercase leading-none">
                                            T{d.getMonth() + 1}
                                        </span>
                                        <span className="text-sm font-black text-gray-700 dark:text-gray-300 leading-none mt-0.5">
                                            {d.getDate()}
                                        </span>
                                    </div>
                                    
                                    {/* Nội dung bên cạnh */}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                                            {evt.summary || '(Không tiêu đề)'}
                                        </p>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                                            <span>{formatTime(evt)}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            <span className="text-orange-400 font-medium">
                                                {diffDays === 0 ? 'Hôm nay' : diffDays === 1 ? 'Ngày mai' : `${diffDays} ngày nữa`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarEventList;