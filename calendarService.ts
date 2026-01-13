// calendarService.ts
export const fetchGoogleEvents = async () => {
  const token = localStorage.getItem('google_calendar_token');
  
  if (!token) {
    console.log("Chưa có token, vui lòng đăng nhập trước.");
    return [];
  }

  // Lấy lịch từ hôm nay
  const timeMin = new Date().toISOString();
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&singleEvents=true&orderBy=startTime`,
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