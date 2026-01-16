import React, { useState, useEffect, useRef } from 'react';
import { addEventToCalendar, updateEvent, listCalendars, GOOGLE_EVENT_COLORS, getEventColor } from '../services/googleCalendarService';
import { useEvents } from '../contexts/EventContext';

const AddEventModal: React.FC = () => {
    // 1. Dùng Global Context để điều khiển
    const { isModalOpen, closeModal, selectedDate, editingEvent, refreshEvents } = useEvents();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('00:00');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('00:00');
    const [isAllDay, setIsAllDay] = useState(false);
    const [recurrence, setRecurrence] = useState('');
    const [activeTab, setActiveTab] = useState<'event' | 'task'>('event');

    // Advanced fields
    const [calendars, setCalendars] = useState<any[]>([]);
    const [selectedCalendarId, setSelectedCalendarId] = useState('primary');
    const [selectedColorId, setSelectedColorId] = useState<string | undefined>(undefined);
    const [transparency, setTransparency] = useState<'opaque' | 'transparent'>('opaque');
    const [visibility, setVisibility] = useState<'default' | 'public' | 'private'>('default');

    // UI State
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const colorPickerRef = useRef<HTMLDivElement>(null);

    // Options for recurrence
    const recurrenceOptions = [
        { label: 'Không lặp lại', value: '' },
        { label: 'Hàng ngày', value: 'RRULE:FREQ=DAILY' },
        { label: 'Hàng tuần', value: 'RRULE:FREQ=WEEKLY' },
        { label: 'Hàng tháng', value: 'RRULE:FREQ=MONTHLY' },
        { label: 'Hàng năm', value: 'RRULE:FREQ=YEARLY' },
        { label: 'Mọi ngày trong tuần (T2-T6)', value: 'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR' },
    ];

    // Fetch Calendar List
    useEffect(() => {
        if (isModalOpen) {
            const fetchCalendars = async () => {
                const list = await listCalendars();
                setCalendars(list);
            };
            fetchCalendars();
        }
    }, [isModalOpen]);

    // Close color picker on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
                setShowColorPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 2. Khi mở modal, reset form & set dữ liệu
    useEffect(() => {
        if (isModalOpen) {
            let start: Date;
            let end: Date;

            if (editingEvent) {
                // EDIT MODE
                setTitle(editingEvent.summary || '');
                setDescription(editingEvent.description || '');
                start = new Date(editingEvent.start?.dateTime || editingEvent.start?.date || editingEvent.start);
                end = new Date(editingEvent.end?.dateTime || editingEvent.end?.date || editingEvent.end);

                const isAllDayEvt = !!editingEvent.start?.date;
                setIsAllDay(isAllDayEvt);

                if (isAllDayEvt) {
                    end.setDate(end.getDate() - 1);
                }

                setRecurrence(editingEvent.recurrence?.[0] || '');
                setSelectedCalendarId('primary');
                setSelectedColorId(editingEvent.colorId);
                setTransparency(editingEvent.transparency || 'opaque');
                setVisibility(editingEvent.visibility || 'default');
            } else {
                setTitle('');
                setDescription('');
                setIsAllDay(false);
                setRecurrence('');
                setSelectedColorId(undefined);
                setTransparency('opaque');
                setVisibility('default');
                start = selectedDate ? new Date(selectedDate) : new Date();
                if (!selectedDate) start = new Date();
                if (start.getHours() === 0 && start.getMinutes() === 0) {
                    const now = new Date();
                    start.setHours(now.getHours(), now.getMinutes());
                }
                end = new Date(start.getTime() + 60 * 60 * 1000);
            }

            const getDateStr = (d: Date) => d.toISOString().split('T')[0];
            const getTimeStr = (d: Date) => {
                const h = String(d.getHours()).padStart(2, '0');
                const m = String(d.getMinutes()).padStart(2, '0');
                return `${h}:${m}`;
            };

            setStartDate(getDateStr(start));
            setStartTime(getTimeStr(start));
            setEndDate(getDateStr(end));
            setEndTime(getTimeStr(end));
            setMessage(null);
        }
    }, [isModalOpen, selectedDate, editingEvent]);

    const getUTCDate = (dateStr: string) => {
        // Parse YYYY-MM-DD manually to avoid timezone shifts
        if (!dateStr) return new Date();
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(Date.UTC(y, m - 1, d));
    };

    const handleStartTimeChange = (newStartTime: string) => {
        const [h1, m1] = startTime.split(':').map(Number);
        const [h2, m2] = newStartTime.split(':').map(Number);
        const diffMs = (h2 * 60 + m2 - (h1 * 60 + m1)) * 60 * 1000;

        setStartTime(newStartTime);

        // Push end time to maintain duration
        const currentEnd = new Date(`${endDate}T${endTime}`);
        const newEnd = new Date(currentEnd.getTime() + diffMs);

        const hEnd = String(newEnd.getHours()).padStart(2, '0');
        const mEnd = String(newEnd.getMinutes()).padStart(2, '0');
        setEndTime(`${hEnd}:${mEnd}`);
        setEndDate(newEnd.toISOString().split('T')[0]);
    };

    const handleEndTimeChange = (newEndTime: string) => {
        setEndTime(newEndTime);
        const startD = new Date(`${startDate}T${startTime}`);
        const endD = new Date(`${endDate}T${newEndTime}`);
        if (endD < startD) {
            const newStart = new Date(endD.getTime() - 60 * 60 * 1000);
            setStartTime(`${String(newStart.getHours()).padStart(2, '0')}:${String(newStart.getMinutes()).padStart(2, '0')}`);
            setStartDate(newStart.toISOString().split('T')[0]);
        }
    };

    const handleStartDateChange = (newStartDate: string) => {
        const oldStart = getUTCDate(startDate);
        const newStart = getUTCDate(newStartDate);
        const diffMs = newStart.getTime() - oldStart.getTime();

        setStartDate(newStartDate);

        // Push end date to maintain day range
        const currentEndDate = getUTCDate(endDate);
        const updatedEndDate = new Date(currentEndDate.getTime() + diffMs);
        setEndDate(updatedEndDate.toISOString().split('T')[0]);
    };

    const handleEndDateChange = (newEndDate: string) => {
        setEndDate(newEndDate);
        const startD = getUTCDate(startDate);
        const endD = getUTCDate(newEndDate);
        if (endD < startD) {
            setStartDate(newEndDate);
        }
    };

    const formatDisplayDate = (dateStr: string, isShort: boolean) => {
        if (!dateStr) return '';
        const d = getUTCDate(dateStr);
        const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

        const date = d.getUTCDate();
        const month = d.getUTCMonth() + 1;
        const year = d.getUTCFullYear();

        if (isShort) {
            return `${date} thg ${month}, ${year}`;
        }
        // For mobile: Thứ Bảy, 17 thg 1
        return `${dayNames[d.getUTCDay()]}, ${date} thg ${month}`;
    };

    if (!isModalOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            // Reconstruct full dates for submission
            const fullStart = new Date(`${startDate}T${startTime}`);
            const fullEnd = new Date(`${endDate}T${endTime}`);

            const eventData: any = {
                summary: title || (activeTab === 'task' ? 'Không tiêu đề (Task)' : 'Không tiêu đề'),
                description: description,
                startDateTime: fullStart,
                endDateTime: fullEnd,
                isAllDay: isAllDay,
                colorId: selectedColorId,
                transparency: transparency,
                visibility: visibility,
                calendarId: selectedCalendarId
            };

            if (recurrence) {
                eventData.recurrence = [recurrence];
            } else {
                eventData.recurrence = [];
            }

            if (editingEvent) {
                await updateEvent(selectedCalendarId, editingEvent.id, eventData);
                setMessage({ type: 'success', text: 'Đã cập nhật thành công!' });
            } else {
                await addEventToCalendar(eventData);
                setMessage({ type: 'success', text: 'Đã lưu thành công!' });
            }

            await refreshEvents();
            setTimeout(() => {
                closeModal();
            }, 1000);
        } catch (error: any) {
            setMessage({ type: 'error', text: error?.message || 'Lỗi kết nối' });
        } finally {
            setIsLoading(false);
        }
    };

    const currentCalendar = calendars.find(c => c.id === selectedCalendarId) || calendars[0] || { summary: 'Đinh Hân', backgroundColor: '#039be5' };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 font-display">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={closeModal}
            ></div>

            <div className="bg-white dark:bg-zinc-900 w-full md:max-w-[540px] md:rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-[float_0.2s_ease-out] flex flex-col h-full md:h-auto md:max-h-[95vh]">

                {/* Desktop Header Actions */}
                <div className="hidden md:flex justify-between items-center px-4 py-3 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <button onClick={closeModal} className="size-8 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center justify-center text-gray-500 transition-colors">
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                        <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200 truncate">{title || 'Sự kiện mới'}</h2>
                    </div>
                </div>

                {/* Mobile Header Actions */}
                <div className="md:hidden flex justify-between items-center px-4 py-3 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-10">
                    <button type="button" onClick={closeModal} className="text-blue-600 text-lg">Hủy</button>
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full mb-1"></div>
                    </div>
                    <button type="button" onClick={handleSubmit} className="text-blue-600 font-bold text-lg">Lưu</button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar">
                    {/* Title Input */}
                    <div className="px-6 py-4 md:mb-4">
                        <input
                            type="text"
                            placeholder="Thêm tiêu đề"
                            className="w-full text-2xl md:text-2xl text-text-main bg-transparent border-b md:border-b border-gray-200 dark:border-zinc-700 focus:border-blue-500 outline-none pb-1 placeholder-gray-400 transition-colors font-medium"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Mobile Type Selection Pills */}
                    <div className="md:hidden flex gap-2 px-6 mb-6 overflow-x-auto no-scrollbar">
                        <button
                            type="button"
                            onClick={() => setActiveTab('event')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'event' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'}`}
                        >
                            Sự kiện
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg text-sm font-bold bg-gray-100 dark:bg-zinc-800 text-gray-500 whitespace-nowrap"
                        >
                            Việc cần làm
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg text-sm font-bold bg-gray-100 dark:bg-zinc-800 text-gray-500 whitespace-nowrap"
                        >
                            Sinh nhật
                        </button>
                    </div>

                    {/* Navigation Tabs (Desktop Only) */}
                    <div className="hidden md:flex px-6 border-b border-gray-100 dark:border-zinc-800 mb-6">
                        <button
                            type="button"
                            className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${activeTab === 'event' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('event')}
                        >
                            Chi tiết sự kiện
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-bold border-b-2 border-transparent text-gray-500 hover:text-gray-700"
                        >
                            Tìm thời gian
                        </button>
                    </div>

                    <div className="px-6 md:px-6">
                        {/* Time Section - THE CORE LOGIC */}
                        <div className="flex items-start gap-4">
                            <span className="material-symbols-outlined text-gray-400 mt-2 hidden md:inline">schedule</span>
                            <div className="flex-1 space-y-3">
                                {/* Desktop Layout */}
                                <div className="hidden md:block">
                                    {isAllDay ? (
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="relative group">
                                                <div className="bg-gray-100 dark:bg-zinc-800 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all text-sm font-bold text-gray-700 dark:text-gray-300">
                                                    {formatDisplayDate(startDate, false)}, {new Date(startDate).getFullYear()}
                                                </div>
                                                <input type="date" className="absolute inset-0 opacity-0 cursor-pointer" value={startDate} onChange={(e) => handleStartDateChange(e.target.value)} />
                                            </div>
                                            <span className="text-gray-400 text-sm">tới</span>
                                            <div className="relative group">
                                                <div className="bg-gray-100 dark:bg-zinc-800 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all text-sm font-bold text-gray-700 dark:text-gray-300">
                                                    {formatDisplayDate(endDate, false)}, {new Date(endDate).getFullYear()}
                                                </div>
                                                <input type="date" className="absolute inset-0 opacity-0 cursor-pointer" value={endDate} onChange={(e) => handleEndDateChange(e.target.value)} />
                                            </div>
                                            <button type="button" className="text-blue-600 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-900/10 px-2 py-1.5 rounded transition-all">
                                                Múi giờ
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="relative group">
                                                <div className="bg-gray-100 dark:bg-zinc-800 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all text-sm font-bold text-gray-700 dark:text-gray-300">
                                                    {formatDisplayDate(startDate, true)}
                                                </div>
                                                <input type="date" className="absolute inset-0 opacity-0 cursor-pointer" value={startDate} onChange={(e) => handleStartDateChange(e.target.value)} />
                                            </div>
                                            <div className="relative group">
                                                <div className="bg-gray-100 dark:bg-zinc-800 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                    {startTime}
                                                </div>
                                                <input type="time" className="absolute inset-0 opacity-0 cursor-pointer" value={startTime} onChange={(e) => handleStartTimeChange(e.target.value)} />
                                            </div>
                                            <span className="text-gray-400 text-sm">tới</span>
                                            <div className="relative group">
                                                <div className="bg-gray-100 dark:bg-zinc-800 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                    {endTime}
                                                </div>
                                                <input type="time" className="absolute inset-0 opacity-0 cursor-pointer" value={endTime} onChange={(e) => handleEndTimeChange(e.target.value)} />
                                            </div>
                                            <div className="relative group">
                                                <div className="bg-gray-100 dark:bg-zinc-800 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all text-sm font-bold text-gray-700 dark:text-gray-300">
                                                    {formatDisplayDate(endDate, true)}
                                                </div>
                                                <input type="date" className="absolute inset-0 opacity-0 cursor-pointer" value={endDate} onChange={(e) => handleEndDateChange(e.target.value)} />
                                            </div>
                                            <button type="button" className="text-blue-600 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-900/10 px-2 py-1.5 rounded transition-all">
                                                Múi giờ
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap items-center gap-4 py-2 mt-3">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`size-5 rounded border flex items-center justify-center transition-all ${isAllDay ? 'bg-blue-600 border-blue-600 shadow-sm' : 'border-gray-400 dark:border-zinc-600 hover:border-blue-500'}`}>
                                                <input type="checkbox" className="hidden" checked={isAllDay} onChange={(e) => setIsAllDay(e.target.checked)} />
                                                {isAllDay && <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>}
                                            </div>
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-text-main">Cả ngày</span>
                                        </label>

                                        <div className="relative group">
                                            <select
                                                className="appearance-none bg-gray-100 dark:bg-zinc-800 border-none rounded-md px-3 py-1.5 pr-8 text-sm font-medium text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                                                value={recurrence}
                                                onChange={(e) => setRecurrence(e.target.value)}
                                            >
                                                {recurrenceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[18px]">arrow_drop_down</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Layout (Image 2) */}
                                <div className="md:hidden space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-gray-400">schedule</span>
                                            <span className="text-[17px] font-medium text-gray-700 dark:text-gray-200">Cả ngày</span>
                                        </div>
                                        <div
                                            onClick={() => setIsAllDay(!isAllDay)}
                                            className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer relative ${isAllDay ? 'bg-blue-600' : 'bg-gray-300 dark:bg-zinc-700'}`}
                                        >
                                            <div className={`size-4 bg-white rounded-full transition-transform shadow-sm ${isAllDay ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="relative pl-10 flex-1">
                                            <div className="text-[17px] font-medium text-gray-700 dark:text-gray-200">
                                                {formatDisplayDate(startDate, false)}
                                            </div>
                                            <input type="date" className="absolute inset-0 opacity-0 w-full" value={startDate} onChange={(e) => handleStartDateChange(e.target.value)} />
                                        </div>
                                        {!isAllDay && (
                                            <div className="relative">
                                                <div className="text-[17px] font-medium text-gray-700 dark:text-gray-200">
                                                    {startTime}
                                                </div>
                                                <input type="time" className="absolute inset-0 opacity-0 w-full" value={startTime} onChange={(e) => handleStartTimeChange(e.target.value)} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="relative pl-10 flex-1">
                                            <div className="text-[17px] font-medium text-gray-700 dark:text-gray-200">
                                                {formatDisplayDate(endDate, false)}
                                            </div>
                                            <input type="date" className="absolute inset-0 opacity-0 w-full" value={endDate} onChange={(e) => handleEndDateChange(e.target.value)} />
                                        </div>
                                        {!isAllDay && (
                                            <div className="relative">
                                                <div className="text-[17px] font-medium text-gray-700 dark:text-gray-200">
                                                    {endTime}
                                                </div>
                                                <input type="time" className="absolute inset-0 opacity-0 w-full" value={endTime} onChange={(e) => handleEndTimeChange(e.target.value)} />
                                            </div>
                                        )}
                                    </div>

                                    <button type="button" className="text-blue-600 text-sm font-bold pl-10">
                                        Tùy chọn khác
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-gray-100 dark:border-zinc-800 mb-6">
                        <button
                            type="button"
                            className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${activeTab === 'event' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('event')}
                        >
                            Chi tiết sự kiện
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-bold border-b-2 border-transparent text-gray-500 hover:text-gray-700"
                        >
                            Tìm thời gian
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Mobile Recurrence */}
                        <div className="md:hidden flex items-center gap-4 px-2 -mx-2 py-2 text-blue-600 font-bold text-sm">
                            Tùy chọn khác
                        </div>

                        {/* Mobile Calendar Selector */}
                        <div className="md:hidden flex flex-wrap gap-2 py-4 border-t border-b border-gray-100 dark:border-zinc-800">
                            {calendars.map(c => (
                                <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => setSelectedCalendarId(c.id)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${selectedCalendarId === c.id ? 'bg-blue-100 text-blue-600 border border-blue-200' : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 border border-transparent'}`}
                                >
                                    <div className="size-2.5 rounded-full" style={{ backgroundColor: c.backgroundColor }}></div>
                                    {c.summary}
                                </button>
                            ))}
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-4 group">
                            <span className="material-symbols-outlined text-gray-400 text-2xl">location_on</span>
                            <div className="flex-1 border-b border-gray-100 dark:border-zinc-800 md:border-transparent group-focus-within:border-blue-500 transition-all bg-transparent md:bg-gray-50 dark:md:bg-zinc-800/30 md:rounded-lg md:px-3">
                                <input type="text" placeholder="Thêm vị trí" className="w-full bg-transparent border-none outline-none text-[17px] md:text-sm font-medium text-text-main placeholder-gray-400 py-3 md:py-2.5" />
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-zinc-800 md:border-none">
                            <span className="material-symbols-outlined text-gray-400 text-2xl">notifications</span>
                            <div className="flex-1 text-[17px] font-medium text-gray-700 dark:text-gray-300">Thêm thông báo</div>
                            <span className="material-symbols-outlined text-gray-400 text-[20px]">unfold_more</span>
                        </div>

                        {/* Guest Section (From Mobile Screenshot) */}
                        <div className="md:hidden flex items-center gap-4 py-3 border-b border-gray-100 dark:border-zinc-800">
                            <span className="material-symbols-outlined text-gray-400 text-2xl">group</span>
                            <div className="flex-1 text-[17px] font-medium text-gray-700 dark:text-gray-300">Thêm khách</div>
                        </div>

                        {/* Calendar & Color Selection */}
                        <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-zinc-800 md:pt-4 md:border-t">
                            <span className="material-symbols-outlined text-gray-400 text-2xl">palette</span>
                            <div className="flex-1 flex items-center justify-between py-1 md:py-0 border-b border-gray-100 dark:border-zinc-800 md:border-none">
                                <span className="md:hidden text-[17px] font-medium text-gray-700 dark:text-gray-300">Màu mặc định</span>
                                <div className="relative" ref={colorPickerRef}>
                                    <button
                                        type="button"
                                        onClick={() => setShowColorPicker(!showColorPicker)}
                                        className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-800/50 border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 px-2 py-1.5 rounded-lg transition-all"
                                    >
                                        <div className="size-5 rounded-full shadow-sm" style={{ backgroundColor: selectedColorId ? getEventColor(selectedColorId) : currentCalendar.backgroundColor }}></div>
                                        <span className="material-symbols-outlined text-gray-400 text-[18px]">unfold_more</span>
                                    </button>
                                    {showColorPicker && (
                                        <div className="absolute bottom-full right-0 mb-2 p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-gray-100 dark:border-zinc-700 z-20 grid grid-cols-4 gap-1 animate-float">
                                            {Object.entries(GOOGLE_EVENT_COLORS).map(([id, hex]) => (
                                                <button key={id} type="button" onClick={() => { setSelectedColorId(id); setShowColorPicker(false); }} className="size-7 rounded-full hover:scale-110 transition-transform flex items-center justify-center shadow-sm" style={{ backgroundColor: hex }}>
                                                    {selectedColorId === id && <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Availability & Visibility */}
                        <div className="hidden md:flex items-center gap-4">
                            <span className="material-symbols-outlined text-gray-400 text-2xl">work</span>
                            <div className="flex-items-center gap-2 flex-1 flex">
                                <div className="relative flex-1 max-w-[120px]">
                                    <select
                                        className="w-full appearance-none bg-gray-50 dark:bg-zinc-800/50 border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 outline-none transition-all cursor-pointer"
                                        value={transparency}
                                        onChange={(e) => setTransparency(e.target.value as any)}
                                    >
                                        <option value="opaque">Bận</option>
                                        <option value="transparent">Rảnh</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">arrow_drop_down</span>
                                </div>

                                <div className="relative flex-1">
                                    <select
                                        className="w-full appearance-none bg-gray-50 dark:bg-zinc-800/50 border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 outline-none transition-all cursor-pointer"
                                        value={visibility}
                                        onChange={(e) => setVisibility(e.target.value as any)}
                                    >
                                        <option value="default">Chế độ hiển thị mặc định</option>
                                        <option value="public">Công khai</option>
                                        <option value="private">Riêng tư</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">arrow_drop_down</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex items-start gap-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                            <span className="material-symbols-outlined text-gray-400 text-2xl pt-1">notes</span>
                            <div className="flex-1 bg-transparent md:bg-gray-50 dark:md:bg-zinc-800/30 md:rounded-xl overflow-hidden border-b md:border-none border-gray-100 dark:border-zinc-800 focus-within:border-blue-500 transition-all">
                                <textarea
                                    placeholder="Thêm nội dung mô tả"
                                    rows={3}
                                    className="w-full bg-transparent p-0 md:p-3 text-[17px] md:text-sm text-text-main placeholder-gray-400 outline-none resize-none"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Mobile Attachments */}
                        <div className="md:hidden flex items-center gap-4 py-4">
                            <span className="material-symbols-outlined text-gray-400 text-2xl">attach_file</span>
                            <span className="text-[17px] font-medium text-gray-600 dark:text-gray-400">Thêm tệp đính kèm trên Google Drive</span>
                        </div>
                    </div>

                    {/* Footer - Desktop Only */}
                    <div className="hidden md:flex justify-between items-center mt-8 sticky bottom-0 bg-white dark:bg-zinc-900 pt-4 border-t border-gray-100 dark:border-zinc-800">
                        <button type="button" className="text-blue-600 font-bold text-sm hover:underline px-2">
                            Tùy chọn khác
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-2.5 rounded-full font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading && <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                            {editingEvent ? 'Cập nhật' : 'Lưu'}
                        </button>
                    </div>

                    {/* Message Toast */}
                    {message && (
                        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] bg-gray-900/90 dark:bg-zinc-800 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-3 animate-[slideUp_0.2s_ease-out]`}>
                            <span className={`material-symbols-outlined ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {message.type === 'success' ? 'check_circle' : 'error'}
                            </span>
                            {message.text}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AddEventModal;