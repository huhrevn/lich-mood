
import { HolidayDef } from "../types/calendarTypes";

// Lễ hội Dương Lịch (Ngày - Tháng)
export const SOLAR_HOLIDAYS: Record<string, HolidayDef> = {
    '1-1': { name: 'Tết Dương Lịch', tag: 'Quốc lễ' },
    '14-2': { name: 'Lễ Tình Nhân (Valentine)', tag: 'Sự kiện quốc tế' },
    '8-3': { name: 'Quốc tế Phụ nữ', tag: 'Sự kiện quốc tế' },
    '30-4': { name: 'Giải phóng Miền Nam', tag: 'Quốc lễ' },
    '1-5': { name: 'Quốc tế Lao động', tag: 'Quốc lễ' },
    '1-6': { name: 'Quốc tế Thiếu nhi', tag: 'Sự kiện quốc tế' },
    '28-6': { name: 'Ngày Gia đình Việt Nam', tag: 'Văn hóa' },
    '27-7': { name: 'Thương binh Liệt sĩ', tag: 'Tưởng niệm' },
    '2-9': { name: 'Quốc Khánh', tag: 'Quốc lễ' },
    '20-10': { name: 'Phụ nữ Việt Nam', tag: 'Văn hóa' },
    '31-10': { name: 'Halloween', tag: 'Sự kiện quốc tế' },
    '20-11': { name: 'Nhà giáo Việt Nam', tag: 'Văn hóa' },
    '22-12': { name: 'Thành lập QĐND Việt Nam', tag: 'Kỷ niệm' },
    '24-12': { name: 'Lễ Giáng Sinh', tag: 'Tôn giáo' },
    '25-12': { name: 'Lễ Giáng Sinh', tag: 'Tôn giáo' }
};

// Lễ hội Âm Lịch (Ngày - Tháng)
export const LUNAR_HOLIDAYS: Record<string, HolidayDef> = {
    '23-12': { name: 'Đưa Ông Táo về trời', tag: 'Tết' },
    '30-12': { name: 'Giao Thừa', tag: 'Tết' },
    '1-1': { name: 'Mùng 1 Tết Nguyên Đán', tag: 'Tết' },
    '2-1': { name: 'Mùng 2 Tết Nguyên Đán', tag: 'Tết' },
    '3-1': { name: 'Mùng 3 Tết Nguyên Đán', tag: 'Tết' },
    '15-1': { name: 'Tết Nguyên Tiêu', tag: 'Lễ hội' },
    '3-3': { name: 'Tết Hàn Thực', tag: 'Văn hóa' },
    '10-3': { name: 'Giỗ Tổ Hùng Vương', tag: 'Quốc lễ' },
    '15-4': { name: 'Lễ Phật Đản', tag: 'Tôn giáo' },
    '5-5': { name: 'Tết Đoan Ngọ', tag: 'Văn hóa' },
    '15-7': { name: 'Lễ Vu Lan', tag: 'Tôn giáo' },
    '15-8': { name: 'Tết Trung Thu', tag: 'Lễ hội' }
};
