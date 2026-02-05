// Types for Good Days Feature

export type ActivityCategory = 'marriage' | 'business' | 'home' | 'travel' | 'spiritual' | 'other';

export interface Activity {
    id: string;
    name: string;
    nameEn: string;
    category: ActivityCategory;
    icon: string; // Material icon name
    description: string;
}

export type DayQuality = 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';

export interface DayRating {
    date: Date;
    solarDate: string; // YYYY-MM-DD
    lunarDate: {
        day: number;
        month: number;
        year: number;
        isLeap: boolean;
    };
    canChi: {
        day: string;
        month: string;
        year: string;
    };
    score: number; // 0-100
    quality: DayQuality;
    activities: {
        activityId: string;
        score: number;
        quality: DayQuality;
        reasons: string[]; // Lý do tốt/xấu
    }[];
    luckyStars: string[]; // Sao tốt
    unluckyStars: string[]; // Sao xấu
    zodiacOfficer: string; // 12 Trực (Kiến, Trừ, Mãn, v.v.)
    isZodiacDay: boolean; // Hoàng đạo hay Hắc đạo
    conflictAges: number[]; // Tuổi xung
}

export interface GoodDaySearchParams {
    activities: string[]; // Activity IDs
    startDate: Date;
    endDate: Date;
    birthYear?: number; // Năm sinh để check tuổi xung
    minScore?: number; // Điểm tối thiểu (default: 60)
    maxResults?: number; // Số kết quả tối đa (default: 30)
}

export interface GoodDayResult {
    date: Date;
    rating: DayRating;
    matchedActivities: string[]; // Activities phù hợp
    averageScore: number;
    highlights: string[]; // Điểm nổi bật
}

export interface DayAnalysis {
    rating: DayRating;
    recommendations: {
        toDo: string[]; // Nên làm
        toAvoid: string[]; // Nên tránh
    };
    detailedAnalysis: {
        canChiAnalysis: string;
        starAnalysis: string;
        zodiacAnalysis: string;
        generalAdvice: string;
    };
}

export interface DateRange {
    start: Date;
    end: Date;
    label: string;
}
