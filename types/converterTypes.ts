
export type ConversionMode = 'SOLAR_TO_LUNAR' | 'LUNAR_TO_SOLAR';

export interface LichAmDuong {
    duong_lich: {
        weekday_vi: string;
        date: string;
    };
    am_lich: {
        date: string;
        can_chi_day: string;
        can_chi_month: string;
        can_chi_year: string;
        leap_month: boolean;
    };
    tiet_khi: {
        name: string;
        range: string;
    };
}

export interface NguHanh {
    nien_menh: string; // e.g., Ốc Thượng Thổ
    ngay_menh: {
        label: string; // Can Chi
        element: string; // Ngũ hành nạp âm (e.g., Hỏa/Thổ)
        fortune: string; // Cát/Hung
    };
    nap_am_ky_tuoi: string[]; // List of conflicting ages
    khac_hanh: {
        day_element: string;
        khac: string;
        note: string;
    };
    hop_xung: {
        luc_hop: string[];
        tam_hop: string[];
        xung: string[];
        hinh: string[];
        hai: string[];
        pha: string[]; // Tương phá
        tuyet: string[]; // Tương tuyệt
        tam_sat_ky_menh: string[];
    };
}

export interface ConversionResult {
    date: Date;
    lunarDay: number;
    lunarMonth: number;
    lunarYear: number;
    isLeap: boolean;
    
    // Legacy flattened props (kept for backward compatibility if needed, but UI will migrate)
    canChiDay: string;
    canChiMonth: string;
    canChiYear: string;
    luckyHours: number[];
    napAm: string;
    isZodiacDay: boolean;
    conflictGroup: string;

    // New Detailed Structures
    lichAmDuong: LichAmDuong;
    nguHanh: NguHanh;
}
