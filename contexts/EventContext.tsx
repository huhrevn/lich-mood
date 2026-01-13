import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; // Sửa lại đường dẫn nếu file firebase nằm chỗ khác
import { fetchGoogleEvents } from '../calendarService'; // Sửa lại đường dẫn nếu cần

interface EventContextType {
  events: any[];
  refreshEvents: () => Promise<void>;
  loading: boolean;
}

const EventContext = createContext<EventContextType>({
  events: [],
  refreshEvents: async () => {},
  loading: false,
});

export const useEvents = () => useContext(EventContext);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // 1. Theo dõi đăng nhập
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadEvents(); // Có người dùng -> Tải lịch ngay
      } else {
        setEvents([]); // Thoát -> Xóa lịch
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Hàm tải lịch
  const loadEvents = async () => {
    setLoading(true);
    const data = await fetchGoogleEvents();
    if (data) {
      // Lọc bỏ bớt dữ liệu rác, chỉ giữ lại cái cần thiết
      const cleanData = data.map((item: any) => ({
        id: item.id,
        summary: item.summary || 'Không tiêu đề',
        start: item.start.dateTime || item.start.date, // Hỗ trợ cả lịch giờ và lịch ngày
        end: item.end.dateTime || item.end.date,
        colorId: item.colorId,
        description: item.description
      }));
      setEvents(cleanData);
      console.log("Đã cập nhật kho sự kiện:", cleanData.length, "mục");
    }
    setLoading(false);
  };

  return (
    <EventContext.Provider value={{ events, refreshEvents: loadEvents, loading }}>
      {children}
    </EventContext.Provider>
  );
};