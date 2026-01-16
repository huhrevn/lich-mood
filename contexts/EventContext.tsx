import React, { createContext, useContext, useState, useEffect } from 'react';
import { listUpcomingEvents, getUserProfile, getPrimaryCalendarColor } from '../services/googleCalendarService';

interface EventContextType {
  events: any[];
  refreshEvents: () => Promise<void>;
  loading: boolean;
  isModalOpen: boolean;
  selectedDate: Date | null;
  editingEvent: any | null;
  openModal: (date?: Date, event?: any) => void;
  closeModal: () => void;
}

const EventContext = createContext<EventContextType>({
  events: [],
  refreshEvents: async () => { },
  loading: false,
  isModalOpen: false,
  selectedDate: null,
  editingEvent: null,
  openModal: () => { },
  closeModal: () => { },
});

export const useEvents = () => useContext(EventContext);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Hàm tải lịch
  const loadEvents = async () => {
    const profile = await getUserProfile();
    if (!profile) {
      setEvents([]);
      return;
    }

    setLoading(true);

    try {
      // Parallel fetch: Events + Primary Color
      const [data, primaryColor] = await Promise.all([
        listUpcomingEvents(),
        getPrimaryCalendarColor()
      ]);

      if (data) {
        const cleanData = data.map((item: any) => ({
          id: item.id,
          summary: item.summary || 'Không tiêu đề',
          // Giữ nguyên object start/end để các component khác (CalendarGrid) dùng linh hoạt
          start: item.start,
          end: item.end,
          isAllDay: !item.start?.dateTime,
          colorId: item.colorId,
          backgroundColor: item.colorId ? null : primaryColor,
          description: item.description,
          creator: item.creator
        }));
        setEvents(cleanData);
        console.log("Đã cập nhật kho sự kiện:", cleanData.length, "mục với màu:", primaryColor);
      }
    } catch (error) {
      console.error("Lỗi khi tải sự kiện:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Lắng nghe sự kiện login/update profile
  useEffect(() => {
    // Tải lần đầu
    loadEvents();

    // Lắng nghe khi user login thành công
    const handleUpdate = () => {
      loadEvents();
    };
    window.addEventListener('user_profile_updated', handleUpdate);

    return () => {
      window.removeEventListener('user_profile_updated', handleUpdate);
    };
  }, []);

  // 3. Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);

  const openModal = (date?: Date, event?: any) => {
    if (event) {
      setEditingEvent(event);
      setSelectedDate(new Date(event.start.dateTime || event.start.date || event.start));
    } else if (date) {
      setSelectedDate(date);
      setEditingEvent(null);
    } else {
      setSelectedDate(new Date());
      setEditingEvent(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setEditingEvent(null);
  };

  return (
    <EventContext.Provider value={{
      events,
      refreshEvents: loadEvents,
      loading,
      isModalOpen,
      selectedDate,
      editingEvent,
      openModal,
      closeModal
    }}>
      {children}
    </EventContext.Provider>
  );
};