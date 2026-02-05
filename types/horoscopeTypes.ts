// Types for Vietnamese Horoscope (Tử Vi Đẩu Số)

export type Gender = 'male' | 'female';
export type CalendarType = 'solar' | 'lunar';

export interface BirthInfo {
    date: Date;
    calendarType: CalendarType;
    hour: number; // 0-11 (Tý to Hợi)
    gender: Gender;
    lunarDate?: {
        day: number;
        month: number;
        year: number;
        isLeap: boolean;
    };
}

export type PalaceName =
    | 'menh' | 'phu-mau' | 'phuc-duc' | 'dien-trach'
    | 'quan-loc' | 'no-boc' | 'thien-di' | 'tat-ach'
    | 'tai-bach' | 'tu-tu' | 'phu-the' | 'huynh-de';

export type EarthlyBranch =
    | 'ty' | 'suu' | 'dan' | 'mao'
    | 'thin' | 'ti' | 'ngo' | 'mui'
    | 'than' | 'dau' | 'tuat' | 'hoi';

export type FiveElements = 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho';

export type StarType = 'major' | 'minor' | 'malefic';

export interface Star {
    id: string;
    name: string;
    type: StarType;
    element?: FiveElements;
    isBenefic: boolean; // Cát tinh hay흉 tinh
    brightness?: number; // Độ sáng (1-5)
    description: string;
}

export interface Palace {
    name: PalaceName;
    branch: EarthlyBranch;
    position: number; // 0-11
    stars: Star[];
    element: FiveElements;
    isLifePalace: boolean; // Cung Mệnh
    meaning: string;
}

export interface BirthChart {
    birthInfo: BirthInfo;
    palaces: Palace[];
    lifePalacePosition: number;
    destiny: FiveElements; // Cục số
    majorStars: Star[];
    analysis: {
        personality: string;
        strengths: string[];
        weaknesses: string[];
        lifeDirection: string;
    };
}

export interface PalaceAnalysis {
    palace: Palace;
    rating: number; // 0-100
    quality: 'excellent' | 'good' | 'neutral' | 'bad';
    interpretation: string;
    advice: string[];
    influences: {
        career?: string;
        wealth?: string;
        health?: string;
        relationship?: string;
        family?: string;
    };
}

export interface YearlyFortune {
    year: number;
    overallRating: number; // 0-100
    luckyMonths: number[]; // 1-12
    unluckyMonths: number[];
    predictions: {
        career: string;
        wealth: string;
        health: string;
        relationship: string;
    };
    advice: string[];
}

export interface Compatibility {
    person1Birth: BirthInfo;
    person2Birth: BirthInfo;
    compatibilityScore: number; // 0-100
    elementRelation: 'mutual-generation' | 'mutual-destruction' | 'neutral';
    analysis: string;
    strengths: string[];
    challenges: string[];
    advice: string[];
}
