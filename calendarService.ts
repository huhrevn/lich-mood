// calendarService.ts
export const fetchGoogleEvents = async () => {
  const token = localStorage.getItem('google_calendar_token');
  
  if (!token) return [];

  // Lấy thời gian: Từ 1 tháng trước -> Đến 1 năm sau
  const now = new Date();
  const timeMin = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const timeMax = new Date(now.getFullYear() + 1, now.getMonth(), 1).toISOString();
  
  try {
    // Thêm maxResults=2500 để không bị sót sự kiện
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&maxResults=2500`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();
    return data.items || [];

  } catch (error) {
    console.error("Lỗi lấy lịch:", error);
    return [];
  }
};