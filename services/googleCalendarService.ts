
// Add type definitions for global objects
declare global {
    interface Window {
        gapi: any;
        google: any;
    }
}

// --- CONFIGURATION ---
// QUAN TRỌNG: Để ứng dụng chạy thật, bạn cần thay chuỗi dưới đây bằng CLIENT ID thật từ Google Cloud Console.
// Nếu để nguyên 'YOUR_CLIENT_ID_HERE...', ứng dụng sẽ chạy ở chế độ DEMO (giả lập thành công).

const CLIENT_ID = '458962328580-uh714vq6c2c3oo1oms3nae292ig2auan.apps.googleusercontent.com';
const API_KEY = '';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
// Cập nhật Scope để lấy cả thông tin Calendar và Profile người dùng
const SCOPES = 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.profile';

// Tự động bật chế độ Demo nếu chưa cấu hình Client ID
const IS_DEMO_MODE = CLIENT_ID.includes('YOUR_CLIENT_ID_HERE');

let tokenClient: any;
let gapiInited = false;
let gisInited = false;
let externalToken: string | null = null; // Token from Firebase

export const setGoogleToken = (token: string) => {
    externalToken = token;
    // Nếu gapi đã init, ta set luôn token vào
    if (gapiInited && window.gapi?.client) {
        window.gapi.client.setToken({ access_token: token });
    }
};

/**
 * Khởi tạo GAPI Client
 */
export const initializeGapiClient = async (): Promise<void> => {
    if (IS_DEMO_MODE) {
        console.warn("⚠️ Running in DEMO MODE. Google API will be mocked.");
        gapiInited = true;
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        if (typeof window.gapi === 'undefined') {
            // Soft fail if script not loaded
            console.error("Google API Script not loaded");
            resolve();
            return;
        }
        window.gapi.load('client', async () => {
            try {
                await window.gapi.client.init({
                    discoveryDocs: [DISCOVERY_DOC],
                });
                gapiInited = true;
                resolve();
            } catch (err) {
                console.error("GAPI Init Error", err);
                // Don't reject, allow app to continue in degraded mode
                resolve();
            }
        });
    });
};

/**
 * Khởi tạo GIS Client
 */
export const initializeGisClient = (): Promise<void> => {
    if (IS_DEMO_MODE) {
        gisInited = true;
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        if (typeof window.google === 'undefined' || !window.google.accounts) {
            console.error("Google Identity Script not loaded");
            resolve();
            return;
        }
        try {
            tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: '',
            });
            gisInited = true;
            resolve();
        } catch (e) {
            console.error("GIS Init Error", e);
            resolve();
        }
    });
};

/**
 * Xử lý đăng nhập (Hoặc giả lập đăng nhập)
 */
export const handleAuthClick = async (): Promise<void> => {
    if (IS_DEMO_MODE) {
        return new Promise((resolve) => {
            console.log("🔒 [DEMO] Simulating Google Login...");
            setTimeout(() => {
                console.log("🔓 [DEMO] Login Success!");
                resolve();
            }, 800);
        });
    }

    return new Promise((resolve, reject) => {
        if (!tokenClient) {
            reject(new Error("Google Services not initialized properly."));
            return;
        }

        tokenClient.callback = async (resp: any) => {
            if (resp.error) {
                reject(resp);
            }
            // LƯU TOKEN VÀO STORAGE
            if (resp.access_token) {
                localStorage.setItem('google_access_token', resp.access_token);
                // Set ngay vào GAPI nếu đang dùng
                if (window.gapi?.client) {
                    window.gapi.client.setToken({ access_token: resp.access_token });
                }
            }
            resolve();
        };

        if (window.gapi.client.getToken() === null) {
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            tokenClient.requestAccessToken({ prompt: '' });
        }
    });
};

/**
 * Lấy thông tin Profile người dùng
 * - Nếu Demo (Admin/Builder): Trả về Admin
 * - Nếu đã login Google: Trả về tên & avatar Google
 * - Nếu chưa login: Trả về null (Guest)
 */
export const getUserProfile = async (): Promise<{ name: string; avatar: string; email?: string } | null> => {
    // 1. Check LocalStorage First (User overrides)
    const storedProfile = localStorage.getItem('app_profile');

    // THỬ KHÔI PHỤC TOKEN TỪ STORAGE NẾU CÓ
    const storedToken = localStorage.getItem('google_access_token');
    if (storedToken && window.gapi?.client && !window.gapi.client.getToken()) {
        window.gapi.client.setToken({ access_token: storedToken });
    }

    if (storedProfile) {
        try {
            const p = JSON.parse(storedProfile);
            return {
                name: p.name,
                avatar: p.avatar,
                email: p.email
            };
        } catch (e) { }
    }

    // 2. Fallback to Demo/API
    if (IS_DEMO_MODE && !externalToken) {
        return {
            name: 'Admin User',
            avatar: 'https://i.pravatar.cc/150?img=68',
            email: 'admin@lichmood.vn'
        };
    }

    // Nếu chưa init GAPI và cũng không có token ngoài thì chịu
    if ((!gapiInited || !window.gapi?.client?.getToken()) && !externalToken) {
        return null; // Chưa login
    }

    try {
        const token = externalToken || window.gapi.client.getToken().access_token;
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`);
        if (response.ok) {
            const data = await response.json();
            return {
                name: data.name,
                avatar: data.picture,
                email: data.email
            };
        }
    } catch (error) {
        console.error("Failed to fetch user profile", error);
    }
    return null;
};

/**
 * Thêm sự kiện vào Calendar (Hoặc giả lập)
 */
export interface CalendarEventInput {
    summary: string;
    description?: string;
    startDateTime: Date;
    endDateTime: Date;
    isAllDay?: boolean;
    recurrence?: string[]; // e.g., ['RRULE:FREQ=DAILY']
    colorId?: string;
    transparency?: 'opaque' | 'transparent'; // 'opaque' = Busy, 'transparent' = Free
    visibility?: 'default' | 'public' | 'private';
    calendarId?: string; // Default 'primary'
}

/**
 * Helper to build event resource for GAPI
 */
const buildEventResource = (event: CalendarEventInput) => {
    const resource: any = {
        'summary': event.summary,
        'description': event.description || '',
    };

    // Helper to get YYYY-MM-DD in LOCAL time
    const getLocalDateString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    if (event.isAllDay) {
        // All-day uses 'date' YYYY-MM-DD
        const startStr = getLocalDateString(event.startDateTime);

        // End date for all-day events is exclusive in Google API
        const endDateObj = new Date(event.endDateTime);
        endDateObj.setDate(endDateObj.getDate() + 1);
        const endStr = getLocalDateString(endDateObj);

        resource.start = { 'date': startStr };
        resource.end = { 'date': endStr };
    } else {
        resource.start = {
            'dateTime': event.startDateTime.toISOString(),
            'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
        resource.end = {
            'dateTime': event.endDateTime.toISOString(),
            'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
    }

    if (event.recurrence && event.recurrence.length > 0) {
        resource.recurrence = event.recurrence;
    }

    if (event.colorId) resource.colorId = event.colorId;
    if (event.transparency) resource.transparency = event.transparency;
    if (event.visibility) resource.visibility = event.visibility;

    return resource;
};

export const addEventToCalendar = async (event: CalendarEventInput): Promise<any> => {
    const calendarId = event.calendarId || 'primary';

    // 1. Chế độ Demo
    if (IS_DEMO_MODE) {
        return new Promise((resolve) => {
            console.log("📅 [DEMO] Adding event to calendar:", event);
            setTimeout(() => {
                resolve({
                    result: {
                        status: 'confirmed',
                        htmlLink: 'https://calendar.google.com/calendar/mock-event'
                    }
                });
            }, 1000);
        });
    }

    if (!gapiInited) await initializeGapiClient();

    if (externalToken) {
        window.gapi.client.setToken({ access_token: externalToken });
    }

    if (!window.gapi.client.getToken()) {
        const storedToken = localStorage.getItem('google_access_token');
        if (storedToken) {
            window.gapi.client.setToken({ access_token: storedToken });
        }
    }

    const eventResource = buildEventResource(event);

    try {
        const response = await window.gapi.client.calendar.events.insert({
            'calendarId': calendarId,
            'resource': eventResource,
        });

        return response;
    } catch (error) {
        console.error("Error adding event", error);
        throw error;
    }
};

/**
 * Lấy danh sách các Calendar của người dùng
 */
export const listCalendars = async (): Promise<any[]> => {
    if (IS_DEMO_MODE) {
        return [
            { id: 'primary', summary: 'Cá nhân', primary: true, backgroundColor: '#039be5' },
            { id: 'work', summary: 'Công việc', backgroundColor: '#d50000' },
            { id: 'family', summary: 'Gia đình', backgroundColor: '#f4511e' }
        ];
    }

    if (!gapiInited) await initializeGapiClient();

    // Khôi phục token từ storage nếu cần
    if (!externalToken && !window.gapi?.client?.getToken()) {
        const storedToken = localStorage.getItem('google_access_token');
        if (storedToken) {
            window.gapi.client.setToken({ access_token: storedToken });
        }
    }

    try {
        const response = await window.gapi.client.calendar.calendarList.list();
        return response.result.items || [];
    } catch (error) {
        console.error("Lỗi lấy danh sách lịch", error);
        return [];
    }
};

/**
 * [NEW] Mock fetch calendar lists for Sync Settings
 */
export const fetchMockCalendars = async (): Promise<Array<{ id: string, summary: string, primary?: boolean, color: string }>> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 'primary', summary: 'Cá nhân (Primary)', primary: true, color: '#0866ff' },
                { id: 'work', summary: 'Công việc', color: '#2563EB' },
                { id: 'family', summary: 'Gia đình', color: '#D97706' },
                { id: 'holidays', summary: 'Ngày lễ Việt Nam', color: '#DC2626' }
            ]);
        }, 600);
    });
};

/**
 * Lấy danh sách sự kiện sắp tới
 * @param maxResults Số lượng tối đa
 */
export const listUpcomingEvents = async (maxResults: number = 10): Promise<any[]> => {
    // 1. Chế độ Demo
    if (IS_DEMO_MODE && !externalToken) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const now = new Date();
                resolve([
                    {
                        id: 'demo1',
                        summary: '[Demo] Họp Team',
                        start: { dateTime: new Date(now.getTime() + 3600000).toISOString() },
                        end: { dateTime: new Date(now.getTime() + 7200000).toISOString() },
                        description: 'Sự kiện mẫu'
                    },
                    {
                        id: 'demo2',
                        summary: '[Demo] Ăn trưa',
                        start: { dateTime: new Date(now.getTime() + 18000000).toISOString() },
                        end: { dateTime: new Date(now.getTime() + 21600000).toISOString() },
                    }
                ]);
            }, 800);
        });
    }

    // 2. Chế độ thật
    if (!gapiInited) await initializeGapiClient();

    // Khôi phục token từ storage nếu cần
    if (!externalToken && !window.gapi?.client?.getToken()) {
        const storedToken = localStorage.getItem('google_access_token');
        if (storedToken) {
            window.gapi.client.setToken({ access_token: storedToken });
        }
    }

    // Nếu vẫn chưa có token thì chịu
    if (!externalToken && !window.gapi?.client?.getToken()) {
        console.warn("Chưa có token để lấy lịch");
        return [];
    }

    try {
        // Lấy thời gian: Từ 1 tháng trước -> Đến 1 năm sau (để CalendarGrid hiển thị đủ)
        const now = new Date();
        const timeMin = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
        const timeMax = new Date(now.getFullYear() + 1, now.getMonth(), 1).toISOString();

        const response = await window.gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': timeMin,
            'timeMax': timeMax,
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 2500,
            'orderBy': 'startTime',
        });

        return response.result.items || [];
    } catch (error) {
        console.error("Lỗi lấy danh sách sự kiện", error);
        return [];
    }
};

/**
 * Lấy mã màu HEX từ colorId của Google Calendar
 */
export const GOOGLE_EVENT_COLORS: Record<string, string> = {
    '1': '#a4bdfc', // Lavender
    '2': '#7ae7bf', // Sage
    '3': '#dbadff', // Grape
    '4': '#ff887c', // Flamingo
    '5': '#fbd75b', // Banana
    '6': '#ffb878', // Tangerine
    '7': '#46d6db', // Peacock
    '8': '#e1e1e1', // Graphite
    '9': '#5484ed', // Blueberry
    '10': '#51b749', // Basil
    '11': '#dc2127', // Tomato
};

/**
 * Lấy mã màu HEX từ colorId của Google Calendar
 */
export const getEventColor = (colorId?: string): string => {
    // Mặc định là màu xanh accent-green nếu không có colorId
    return (colorId && GOOGLE_EVENT_COLORS[colorId]) || '#10b981';
};

/**
 * Sign out
 */
export const handleSignoutClick = () => {
    localStorage.removeItem('app_profile'); // Clear local override on logout
    localStorage.removeItem('google_access_token'); // Clear token
    if (IS_DEMO_MODE) return;

    const token = window.gapi.client.getToken();
    if (token !== null) {
        // Try revoke if possible, otherwise just clear client
        try {
            window.google.accounts.oauth2.revoke(token.access_token, () => {
                window.gapi.client.setToken(null);
            });
        } catch (e) {
            window.gapi.client.setToken(null);
        }
    }
};
/**
 * Lấy màu mặc định của Lịch Chính (Primary Calendar)
 */
export const getPrimaryCalendarColor = async (): Promise<string> => {
    if (IS_DEMO_MODE) return '#039be5'; // Demo default blue

    if (!gapiInited) await initializeGapiClient();

    // Khôi phục token từ storage nếu cần
    if (!externalToken && !window.gapi?.client?.getToken()) {
        const storedToken = localStorage.getItem('google_access_token');
        if (storedToken) {
            window.gapi.client.setToken({ access_token: storedToken });
        }
    }

    // Nếu vẫn chưa có token, trả về màu mặc định nhưng cảnh báo
    if (!externalToken && !window.gapi?.client?.getToken()) {
        console.warn("Chưa có token để lấy màu lịch");
        return '#039be5';
    }

    try {
        const response = await window.gapi.client.calendar.calendarList.list({
            minAccessRole: 'owner'
        });

        const calendars = response.result.items;
        const primary = calendars?.find((c: any) => c.primary);

        const color = primary?.backgroundColor || '#039be5';
        console.log("Tìm thấy màu lịch chính:", color);
        return color;
    } catch (error) {
        console.error("Error fetching calendar color", error);
        return '#039be5'; // Fallback
    }
};

/**
 * Xóa sự kiện
 */
export const deleteEvent = async (calendarId: string, eventId: string): Promise<void> => {
    if (IS_DEMO_MODE) {
        return new Promise((resolve) => {
            console.log(`[DEMO] Deleting event ${eventId} from ${calendarId}`);
            setTimeout(resolve, 500);
        });
    }

    if (!gapiInited) await initializeGapiClient();

    try {
        await window.gapi.client.calendar.events.delete({
            'calendarId': calendarId || 'primary',
            'eventId': eventId
        });
        console.log("Event deleted successfully");
    } catch (error) {
        console.error("Error deleting event", error);
        throw error;
    }
};

/**
 * Cập nhật sự kiện
 */
export const updateEvent = async (calendarId: string, eventId: string, event: CalendarEventInput): Promise<any> => {
    if (IS_DEMO_MODE) {
        return new Promise((resolve) => {
            console.log(`[DEMO] Updating event ${eventId} in ${calendarId}:`, event);
            setTimeout(() => {
                resolve({
                    result: { status: 'confirmed' }
                });
            }, 1000);
        });
    }

    if (!gapiInited) await initializeGapiClient();

    const eventResource = buildEventResource(event);

    try {
        const response = await window.gapi.client.calendar.events.update({
            'calendarId': calendarId || 'primary',
            'eventId': eventId,
            'resource': eventResource,
        });
        console.log("Event updated successfully");
        return response;
    } catch (error) {
        console.error("Error updating event", error);
        throw error;
    }
};
