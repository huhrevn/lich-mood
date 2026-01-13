
export interface HolidayDef {
    name: string;
    tag: string; // 'Quốc lễ' | 'Tết' | 'Lễ hội' | 'Sự kiện quốc tế' | 'Văn hóa' | 'Tưởng niệm' | 'Kỷ niệm' | 'Tôn giáo'
}

export interface CalendarEvent {
    date: Date;
    lunarDateStr: string;
    title: string;
    type: 'SOLAR' | 'LUNAR';
    tag: string;
    daysLeft: number;
    isSearchMatch?: boolean;
}
