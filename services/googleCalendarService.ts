
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

const CLIENT_ID = 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com'; 
const API_KEY = ''; 
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
// Cập nhật Scope để lấy cả thông tin Calendar và Profile người dùng
const SCOPES = 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.profile';

// Tự động bật chế độ Demo nếu chưa cấu hình Client ID
const IS_DEMO_MODE = CLIENT_ID.includes('YOUR_CLIENT_ID_HERE');

let tokenClient: any;
let gapiInited = false;
let gisInited = false;

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
    if (storedProfile) {
        try {
            const p = JSON.parse(storedProfile);
            return {
                name: p.name,
                avatar: p.avatar,
                email: p.email
            };
        } catch (e) {}
    }

    // 2. Fallback to Demo/API
    if (IS_DEMO_MODE) {
        return { 
            name: 'Admin User', 
            avatar: 'https://i.pravatar.cc/150?img=68',
            email: 'admin@lichmood.vn'
        };
    }

    if (!gapiInited || !window.gapi?.client?.getToken()) {
        return null; // Chưa login
    }

    try {
        const token = window.gapi.client.getToken().access_token;
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
}

export const addEventToCalendar = async (event: CalendarEventInput): Promise<any> => {
    // 1. Nếu đang ở chế độ Demo -> Trả về thành công giả
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
            }, 1500); // Fake network delay
        });
    }

    // 2. Chế độ thật
    if (!gapiInited) await initializeGapiClient();
    
    // Đảm bảo có token
    if (!window.gapi.client.getToken()) {
        await handleAuthClick();
    }

    const eventResource = {
        'summary': event.summary,
        'description': event.description || 'Sự kiện được tạo từ ứng dụng Lịch Mood',
        'start': {
            'dateTime': event.startDateTime.toISOString(),
            'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        'end': {
            'dateTime': event.endDateTime.toISOString(),
            'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
    };

    try {
        const request = window.gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': eventResource,
        });

        const response = await request;
        return response;
    } catch (error) {
        console.error("Error adding event", error);
        throw error;
    }
};

/**
 * [NEW] Mock fetch calendar lists for Sync Settings
 */
export const fetchMockCalendars = async (): Promise<Array<{id: string, summary: string, primary?: boolean, color: string}>> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 'primary', summary: 'Cá nhân (Primary)', primary: true, color: '#4A7B4F' },
                { id: 'work', summary: 'Công việc', color: '#2563EB' },
                { id: 'family', summary: 'Gia đình', color: '#D97706' },
                { id: 'holidays', summary: 'Ngày lễ Việt Nam', color: '#DC2626' }
            ]);
        }, 600);
    });
};

/**
 * Sign out
 */
export const handleSignoutClick = () => {
    localStorage.removeItem('app_profile'); // Clear local override on logout
    if (IS_DEMO_MODE) return;
    
    const token = window.gapi.client.getToken();
    if (token !== null) {
        window.google.accounts.oauth2.revoke(token.access_token, () => {
            window.gapi.client.setToken(null);
        });
    }
};
