import { useState, useMemo, useEffect } from 'react';
import lunisolar from 'lunisolar';
import { CalendarEvent, HolidayDef } from '../../types/calendarTypes';
import { SOLAR_HOLIDAYS, LUNAR_HOLIDAYS } from '../../constants/calendarConstants';
import { getUserProfile } from '../../services/googleCalendarService';

interface UserProfile {
    name: string;
    avatar: string;
}

export const useCalendarPageLogic = () => {
    // --- STATE ---
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());
    
    // User State (Isolated for Calendar Module)
    const [user, setUser] = useState<UserProfile>({
        name: 'Khách',
        avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
    });
    const [greeting, setGreeting] = useState('Xin chào');

    // Picker State
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    
    // Search State
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // --- EFFECTS ---
    // 1. Clock & User (Duplicated from HomeLogic to ensure isolation)
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        
        const loadUser = () => {
            getUserProfile().then(p => { if (p) setUser(p); }).catch(() => {});
        };
        loadUser();
        
        window.addEventListener('user_profile_updated', loadUser);
        return () => { 
            clearInterval(timer);
            window.removeEventListener('user_profile_updated', loadUser);
        }
    }, []);

    // --- HELPERS ---
    function isLeapYear(year: number) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // --- EVENT LOGIC ---
    const events = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentYear = currentDate.getFullYear(); 

        let resultEvents: CalendarEvent[] = [];

        // MODE 1: SEARCHING
        if (searchQuery.trim().length > 0) {
            const query = searchQuery.toLowerCase();
            const searchResults: CalendarEvent[] = [];

            // A. Search by Holiday Name (Scan Solar Holidays)
            Object.entries(SOLAR_HOLIDAYS).forEach(([key, def]) => {
                if (def.name.toLowerCase().includes(query)) {
                    const [d, m] = key.split('-').map(Number);
                    const eventDate = new Date(currentYear, m - 1, d);
                    
                    if (eventDate.getFullYear() < 1900 || eventDate.getFullYear() > 2100) return;

                    try {
                        const l = lunisolar(eventDate);
                        const isLeap = (l.lunar as any).isLeap;
                        
                        const diffTime = eventDate.getTime() - today.getTime();
                        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        searchResults.push({
                            date: eventDate,
                            lunarDateStr: `${l.lunar.day}/${l.lunar.month} ${isLeap ? '(Nhuận) ' : ''}ÂL`,
                            title: def.name,
                            tag: def.tag,
                            type: 'SOLAR',
                            daysLeft: daysLeft,
                            isSearchMatch: true
                        });
                    } catch (e) {}
                }
            });

            // B. Search by Holiday Name (Scan Lunar Holidays)
            Object.entries(LUNAR_HOLIDAYS).forEach(([key, def]) => {
                if (def.name.toLowerCase().includes(query)) {
                    const [d, m] = key.split('-').map(Number);
                    let scanDate = new Date(currentYear, 0, 1);
                    for (let i=0; i<365 + (isLeapYear(currentYear)?1:0); i++) {
                        if (scanDate.getFullYear() < 1900 || scanDate.getFullYear() > 2100) {
                            scanDate.setDate(scanDate.getDate() + 1);
                            continue;
                        }
                        try {
                            const l = lunisolar(scanDate);
                            if (l.lunar.day === d && l.lunar.month === m) {
                                const diffTime = scanDate.getTime() - today.getTime();
                                const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                const isLeap = (l.lunar as any).isLeap;

                                searchResults.push({
                                    date: new Date(scanDate),
                                    lunarDateStr: `${l.lunar.day}/${l.lunar.month} ${isLeap ? '(Nhuận) ' : ''}ÂL`,
                                    title: def.name,
                                    tag: def.tag,
                                    type: 'LUNAR',
                                    daysLeft: daysLeft,
                                    isSearchMatch: true
                                });
                                break; 
                            }
                        } catch (e) {}
                        scanDate.setDate(scanDate.getDate() + 1);
                    }
                }
            });

            // C. Search by Specific Date
            const dateMatch = query.match(/^(\d{1,2})[./-](\d{1,2})(.*)$/);
            if (dateMatch) {
                const d = parseInt(dateMatch[1]);
                const m = parseInt(dateMatch[2]);
                const suffix = dateMatch[3].trim();
                const isLunarSearch = ['am', 'âm', 'al', 'lunar'].some(s => suffix.includes(s));

                if (d > 0 && d <= 31 && m > 0 && m <= 12) {
                    if (isLunarSearch) {
                         let scanDate = new Date(currentYear, 0, 1);
                         for (let i=0; i<380; i++) {
                            if (scanDate.getFullYear() >= 1900 && scanDate.getFullYear() <= 2100) {
                                try {
                                    const l = lunisolar(scanDate);
                                    if (l.lunar.day === d && l.lunar.month === m) {
                                        const diffTime = scanDate.getTime() - today.getTime();
                                        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                        const isLeap = (l.lunar as any).isLeap;
                                        searchResults.push({
                                            date: new Date(scanDate),
                                            lunarDateStr: `${l.lunar.day}/${l.lunar.month} ${isLeap ? '(Nhuận) ' : ''}ÂL`,
                                            title: `Ngày ${d}/${m} Âm Lịch`,
                                            tag: 'Tìm kiếm',
                                            type: 'LUNAR',
                                            daysLeft: daysLeft,
                                            isSearchMatch: true
                                        });
                                        break;
                                    }
                                } catch (e) {}
                            }
                            scanDate.setDate(scanDate.getDate() + 1);
                         }
                    } else {
                        const solarDate = new Date(currentYear, m - 1, d);
                        if (solarDate.getFullYear() >= 1900 && solarDate.getFullYear() <= 2100) {
                            try {
                                const l = lunisolar(solarDate);
                                const isLeap = (l.lunar as any).isLeap;
                                const diffTime = solarDate.getTime() - today.getTime();
                                const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                
                                searchResults.push({
                                    date: solarDate,
                                    lunarDateStr: `${l.lunar.day}/${l.lunar.month} ${isLeap ? '(Nhuận) ' : ''}ÂL`,
                                    title: `Ngày ${d}/${m} Dương Lịch`,
                                    tag: 'Tìm kiếm',
                                    type: 'SOLAR',
                                    daysLeft: daysLeft,
                                    isSearchMatch: true
                                });
                            } catch (e) {}
                        }
                    }
                }
            }
            resultEvents = searchResults.sort((a, b) => a.date.getTime() - b.date.getTime());

        } else {
            // MODE 2: SCAN EVENTS AROUND SELECTED DATE
            const rangeStart = new Date(currentDate);
            rangeStart.setDate(currentDate.getDate() - 45); 

            for (let i = 0; i <= 90; i++) {
                const dateCheck = new Date(rangeStart);
                dateCheck.setDate(rangeStart.getDate() + i);

                const diffTime = dateCheck.getTime() - today.getTime();
                const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (daysLeft < 0) continue;
                if (dateCheck.getFullYear() < 1900 || dateCheck.getFullYear() > 2100) continue;

                const day = dateCheck.getDate();
                const month = dateCheck.getMonth() + 1;

                // Solar Holidays
                const solarKey = `${day}-${month}`;
                if (SOLAR_HOLIDAYS[solarKey]) {
                    try {
                        const l = lunisolar(dateCheck);
                        const isLeap = (l.lunar as any).isLeap;
                        resultEvents.push({
                            date: new Date(dateCheck),
                            lunarDateStr: `${l.lunar.day}/${l.lunar.month} ${isLeap ? '(Nhuận) ' : ''}ÂL`,
                            title: SOLAR_HOLIDAYS[solarKey].name,
                            tag: SOLAR_HOLIDAYS[solarKey].tag,
                            type: 'SOLAR',
                            daysLeft: daysLeft
                        });
                    } catch (e) {}
                }

                // Lunar Holidays
                try {
                    const l = lunisolar(dateCheck);
                    const lunarKey = `${l.lunar.day}-${l.lunar.month}`;
                    const isLeap = (l.lunar as any).isLeap;
                    
                    if (LUNAR_HOLIDAYS[lunarKey] && !isLeap) {
                        resultEvents.push({
                            date: new Date(dateCheck),
                            lunarDateStr: `${l.lunar.day}/${l.lunar.month} ÂL`,
                            title: LUNAR_HOLIDAYS[lunarKey].name,
                            tag: LUNAR_HOLIDAYS[lunarKey].tag,
                            type: 'LUNAR',
                            daysLeft: daysLeft
                        });
                    }
                } catch (e) {}
            }
            resultEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
        }
        return resultEvents;
    }, [searchQuery, currentDate]);

    // --- ACTIONS ---
    const handleMonthSelect = (year: number, monthIndex: number) => {
        const newDate = new Date(currentDate);
        newDate.setFullYear(year);
        newDate.setMonth(monthIndex);
        newDate.setDate(1); 
        setCurrentDate(newDate);
        setIsPickerOpen(false);
    };

    const handleEventClick = (event: CalendarEvent) => {
        setCurrentDate(new Date(event.date));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setIsSearchOpen(false);
    };

    return {
        state: {
            currentDate,
            currentTime,
            user,
            greeting,
            events,
            isPickerOpen,
            isSearchOpen,
            searchQuery
        },
        actions: {
            setCurrentDate,
            setIsPickerOpen,
            setIsSearchOpen,
            setSearchQuery,
            handleMonthSelect,
            handleEventClick,
            handleClearSearch
        }
    };
};