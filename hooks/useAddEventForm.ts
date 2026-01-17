import { useState, useEffect, useRef } from 'react';
import { addEventToCalendar, updateEvent, listCalendars, getEventColor } from '../services/googleCalendarService';
import { useEvents } from '../contexts/EventContext';

export interface Calendar {
    id: string;
    summary: string;
    backgroundColor: string;
}

export const useAddEventForm = () => {
    // 1. Global Context
    const { isModalOpen, closeModal, selectedDate, editingEvent, refreshEvents } = useEvents();

    // 2. Local State
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
    const [calendars, setCalendars] = useState<Calendar[]>([]);
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

    // Reset Form & Set Data on Modal Open
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
                setSelectedCalendarId('primary'); // Default for now, ideally should match event's calendar
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
        if (!dateStr) return new Date();
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(Date.UTC(y, m - 1, d));
    };

    // Date/Time Handlers
    const handleStartTimeChange = (newStartTime: string) => {
        const [h1, m1] = startTime.split(':').map(Number);
        const [h2, m2] = newStartTime.split(':').map(Number);
        const diffMs = (h2 * 60 + m2 - (h1 * 60 + m1)) * 60 * 1000;

        setStartTime(newStartTime);

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

        if (isShort) return `${date} thg ${month}, ${year}`;
        return `${dayNames[d.getUTCDay()]}, ${date} thg ${month}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
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

    const currentCalendar = calendars.find(c => c.id === selectedCalendarId) || calendars[0] || { summary: 'Calendar', backgroundColor: '#039be5' };

    return {
        // State
        title, setTitle,
        description, setDescription,
        startDate, handleStartDateChange,
        startTime, handleStartTimeChange,
        endDate, handleEndDateChange,
        endTime, handleEndTimeChange,
        isAllDay, setIsAllDay,
        recurrence, setRecurrence,
        activeTab, setActiveTab,
        calendars, selectedCalendarId, setSelectedCalendarId,
        selectedColorId, setSelectedColorId,
        transparency, setTransparency,
        visibility, setVisibility,
        showColorPicker, setShowColorPicker,
        isLoading, message,
        colorPickerRef, recurrenceOptions,
        editingEvent,

        // Utils
        formatDisplayDate,
        handleSubmit,
        closeModal,
        currentCalendar,
        getEventColor
    };
};
