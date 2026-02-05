// Types for Memorial Day Reminder

export type MemorialRelation =
    | 'ong-noi' | 'ba-noi' | 'ong-ngoai' | 'ba-ngoai'
    | 'cha' | 'me' | 'vo' | 'chong'
    | 'anh' | 'chi' | 'em'
    | 'bac' | 'chu' | 'co' | 'di'
    | 'khac';

export interface Memorial {
    id: string;
    name: string; // Tên người quá cố
    relation: MemorialRelation; // Quan hệ
    lunarDay: number; // Ngày âm lịch (1-30)
    lunarMonth: number; // Tháng âm lịch (1-12)
    note?: string; // Ghi chú
    createdAt: Date;
}

export interface UpcomingMemorial {
    memorial: Memorial;
    solarDate: Date; // Ngày dương lịch năm nay
    daysUntil: number; // Số ngày còn lại
    isThisYear: boolean; // Có phải năm nay không
    yearCount?: number; // Năm thứ mấy (optional)
}

export interface MemorialFormData {
    name: string;
    relation: MemorialRelation;
    lunarDay: number;
    lunarMonth: number;
    note?: string;
}
