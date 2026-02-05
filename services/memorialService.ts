import lunisolar from 'lunisolar';
import { Memorial, UpcomingMemorial, MemorialFormData } from '../types/memorialTypes';

const STORAGE_KEY = 'memorial_days';

/**
 * Convert lunar date to solar date for a specific year
 */
export const convertLunarToSolar = (lunarDay: number, lunarMonth: number, year: number): Date => {
    try {
        // Create a solar date first, then convert to lunar to find the correct solar equivalent
        // We'll iterate through the year to find the matching lunar date
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const ls = lunisolar(new Date(d));
            if (ls.lunar.day === lunarDay && ls.lunar.month === lunarMonth) {
                return new Date(d);
            }
        }

        // Fallback: return approximate date
        return new Date(year, lunarMonth - 1, lunarDay);
    } catch (error) {
        console.error('Error converting lunar to solar:', error);
        // Fallback: return approximate date
        return new Date(year, lunarMonth - 1, lunarDay);
    }
};

/**
 * Get all memorials from localStorage
 */
export const getMemorials = (): Memorial[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const memorials = JSON.parse(stored);
        return memorials.map((m: any) => ({
            ...m,
            createdAt: new Date(m.createdAt)
        }));
    } catch (error) {
        console.error('Error loading memorials:', error);
        return [];
    }
};

/**
 * Save memorial to localStorage
 */
export const saveMemorial = (formData: MemorialFormData): Memorial => {
    const memorials = getMemorials();

    const newMemorial: Memorial = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date()
    };

    memorials.push(newMemorial);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memorials));

    return newMemorial;
};

/**
 * Update existing memorial
 */
export const updateMemorial = (id: string, formData: MemorialFormData): Memorial | null => {
    const memorials = getMemorials();
    const index = memorials.findIndex(m => m.id === id);

    if (index === -1) return null;

    const updated: Memorial = {
        ...memorials[index],
        ...formData
    };

    memorials[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memorials));

    return updated;
};

/**
 * Delete memorial
 */
export const deleteMemorial = (id: string): boolean => {
    const memorials = getMemorials();
    const filtered = memorials.filter(m => m.id !== id);

    if (filtered.length === memorials.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
};

/**
 * Get upcoming memorials within next N days
 */
export const getUpcomingMemorials = (daysAhead: number = 30): UpcomingMemorial[] => {
    const memorials = getMemorials();
    const today = new Date();
    const currentYear = today.getFullYear();
    const nextYear = currentYear + 1;

    const upcoming: UpcomingMemorial[] = [];

    memorials.forEach(memorial => {
        // Try current year
        const solarDateThisYear = convertLunarToSolar(
            memorial.lunarDay,
            memorial.lunarMonth,
            currentYear
        );

        const daysUntilThisYear = Math.floor(
            (solarDateThisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysUntilThisYear >= 0 && daysUntilThisYear <= daysAhead) {
            upcoming.push({
                memorial,
                solarDate: solarDateThisYear,
                daysUntil: daysUntilThisYear,
                isThisYear: true
            });
        } else if (daysUntilThisYear < 0) {
            // Already passed this year, check next year
            const solarDateNextYear = convertLunarToSolar(
                memorial.lunarDay,
                memorial.lunarMonth,
                nextYear
            );

            const daysUntilNextYear = Math.floor(
                (solarDateNextYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (daysUntilNextYear <= daysAhead) {
                upcoming.push({
                    memorial,
                    solarDate: solarDateNextYear,
                    daysUntil: daysUntilNextYear,
                    isThisYear: false
                });
            }
        }
    });

    // Sort by days until
    return upcoming.sort((a, b) => a.daysUntil - b.daysUntil);
};

/**
 * Get all memorials with their solar dates for current year
 */
export const getAllMemorialsWithDates = (): UpcomingMemorial[] => {
    const memorials = getMemorials();
    const currentYear = new Date().getFullYear();
    const today = new Date();

    return memorials.map(memorial => {
        const solarDate = convertLunarToSolar(
            memorial.lunarDay,
            memorial.lunarMonth,
            currentYear
        );

        const daysUntil = Math.floor(
            (solarDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
            memorial,
            solarDate,
            daysUntil,
            isThisYear: daysUntil >= 0
        };
    }).sort((a, b) => {
        // Sort by month, then day
        if (a.memorial.lunarMonth !== b.memorial.lunarMonth) {
            return a.memorial.lunarMonth - b.memorial.lunarMonth;
        }
        return a.memorial.lunarDay - b.memorial.lunarDay;
    });
};

/**
 * Get relation label in Vietnamese
 */
export const getRelationLabel = (relation: Memorial['relation']): string => {
    const labels: Record<Memorial['relation'], string> = {
        'ong-noi': 'Ông nội',
        'ba-noi': 'Bà nội',
        'ong-ngoai': 'Ông ngoại',
        'ba-ngoai': 'Bà ngoại',
        'cha': 'Cha',
        'me': 'Mẹ',
        'vo': 'Vợ',
        'chong': 'Chồng',
        'anh': 'Anh',
        'chi': 'Chị',
        'em': 'Em',
        'bac': 'Bác',
        'chu': 'Chú',
        'co': 'Cô',
        'di': 'Dì',
        'khac': 'Khác'
    };

    return labels[relation] || relation;
};
