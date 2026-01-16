import React, { useRef, useEffect } from 'react';
import { getEventColor } from '../../../services/googleCalendarService';

interface EventDetailModalProps {
    event: any;
    onClose: () => void;
    onDelete: (event: any) => void;
    onEdit: (event: any) => void;
    position?: { top: number, left: number }; // Optional for popover positioning
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose, onDelete, onEdit }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    if (!event) return null;

    const eventColor = getEventColor(event.colorId);

    // Format Date Range
    const start = new Date(event.start.dateTime || event.start.date);
    const end = new Date(event.end.dateTime || event.end.date);
    const isAllDay = !event.start.dateTime;

    const rawDateStr = start.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });
    const dateStr = rawDateStr.charAt(0).toUpperCase() + rawDateStr.slice(1);
    const timeStr = isAllDay ? 'Cả ngày' : `${start.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
            <div
                ref={modalRef}
                className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            >
                {/* Header Actions */}
                <div className="flex items-center justify-end gap-1 p-2 bg-gray-50/50 dark:bg-zinc-700/30">
                    <button
                        onClick={() => onEdit(event)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition-colors"
                        title="Chỉnh sửa"
                    >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button
                        onClick={() => onDelete(event)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition-colors"
                        title="Xóa"
                    >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                    <button
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition-colors"
                        title="Gửi email cho khách"
                    >
                        <span className="material-symbols-outlined text-[20px]">mail</span>
                    </button>
                    <button
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition-colors"
                        title="Tùy chọn khác"
                    >
                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition-colors ml-1"
                        title="Đóng"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 pt-2">
                    <div className="flex gap-4">
                        {/* Color Indicator */}
                        <div className="pt-1.5">
                            <div className="size-4 rounded-md shadow-sm" style={{ backgroundColor: eventColor }}></div>
                        </div>

                        <div className="flex flex-col gap-1">
                            {/* Title */}
                            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 leading-snug">
                                {event.summary || '(Không tiêu đề)'}
                            </h2>

                            {/* Date Time */}
                            <div className="flex flex-col text-sm text-gray-700 dark:text-gray-300 mt-1">
                                <span className="font-medium">
                                    {dateStr} <span className="mx-1.5 opacity-50">·</span> {timeStr}
                                </span>
                            </div>

                            {/* Calendar Name */}
                            <div className="flex items-center gap-3 mt-4 text-sm text-gray-600 dark:text-gray-400">
                                <span className="material-symbols-outlined text-[20px] opacity-70">calendar_today</span>
                                <span className="font-medium">Đinh Hân</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailModal;
