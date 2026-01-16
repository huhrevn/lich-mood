
import React, { useMemo } from 'react';
import lunisolar from 'lunisolar';

const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

const NAP_AM_MAP: Record<string, string> = {
    'Giáp Tý': 'Hải Trung Kim', 'Ất Sửu': 'Hải Trung Kim', 'Bính Dần': 'Lư Trung Hỏa', 'Đinh Mão': 'Lư Trung Hỏa',
    'Mậu Thìn': 'Đại Lâm Mộc', 'Kỷ Tỵ': 'Đại Lâm Mộc', 'Canh Ngọ': 'Lộ Bàng Thổ', 'Tân Mùi': 'Lộ Bàng Thổ',
    'Nhâm Thân': 'Kiếm Phong Kim', 'Quý Dậu': 'Kiếm Phong Kim', 'Giáp Tuất': 'Sơn Đầu Hỏa', 'Ất Hợi': 'Sơn Đầu Hỏa',
    'Bính Tý': 'Giản Hạ Thủy', 'Đinh Sửu': 'Giản Hạ Thủy', 'Mậu Dần': 'Thành Đầu Thổ', 'Kỷ Mão': 'Thành Đầu Thổ',
    'Canh Thìn': 'Bạch Lạp Kim', 'Tân Tỵ': 'Bạch Lạp Kim', 'Nhâm Ngọ': 'Dương Liễu Mộc', 'Quý Mùi': 'Dương Liễu Mộc',
    'Giáp Thân': 'Tuyền Trung Thủy', 'Ất Dậu': 'Tuyền Trung Thủy', 'Bính Tuất': 'Ốc Thượng Thổ', 'Đinh Hợi': 'Ốc Thượng Thổ',
    'Mậu Tý': 'Tích Lịch Hỏa', 'Kỷ Sửu': 'Tích Lịch Hỏa', 'Canh Dần': 'Tùng Bách Mộc', 'Tân Mão': 'Tùng Bách Mộc',
    'Nhâm Thìn': 'Trường Lưu Thủy', 'Quý Tỵ': 'Trường Lưu Thủy', 'Giáp Ngọ': 'Sa Trung Kim', 'Ất Mùi': 'Sa Trung Kim',
    'Bính Thân': 'Sơn Hạ Hỏa', 'Đinh Dậu': 'Sơn Hạ Hỏa', 'Mậu Tuất': 'Bình Địa Mộc', 'Kỷ Hợi': 'Bình Địa Mộc',
    'Canh Tý': 'Bích Thượng Thổ', 'Tân Sửu': 'Bích Thượng Thổ', 'Nhâm Dần': 'Kim Bạch Kim', 'Quý Mão': 'Kim Bạch Kim',
    'Giáp Thìn': 'Phú Đăng Hỏa', 'Ất Tỵ': 'Phú Đăng Hỏa', 'Bính Ngọ': 'Thiên Hà Thủy', 'Đinh Mùi': 'Thiên Hà Thủy',
    'Mậu Thân': 'Đại Trạch Thổ', 'Kỷ Dậu': 'Đại Trạch Thổ', 'Canh Tuất': 'Thoa Xuyến Kim', 'Tân Hợi': 'Thoa Xuyến Kim',
    'Nhâm Tý': 'Tang Đố Mộc', 'Quý Sửu': 'Tang Đố Mộc', 'Giáp Dần': 'Đại Khê Thủy', 'Ất Mão': 'Đại Khê Thủy',
    'Bính Thìn': 'Sa Trung Thổ', 'Đinh Tỵ': 'Sa Trung Thổ', 'Mậu Ngọ': 'Thiên Thượng Hỏa', 'Kỷ Mùi': 'Thiên Thượng Hỏa',
    'Canh Thân': 'Thạch Lựu Mộc', 'Tân Dậu': 'Thạch Lựu Mộc', 'Nhâm Tuất': 'Đại Hải Thủy', 'Quý Hợi': 'Đại Hải Thủy'
};

const ZODIAC_HOURS_MAP: Record<number, number[]> = {
    0: [0, 1, 3, 6, 8, 9], 1: [2, 3, 5, 8, 10, 11], 2: [0, 1, 4, 5, 7, 10], 3: [0, 2, 3, 6, 7, 9],
    4: [2, 4, 5, 8, 9, 11], 5: [1, 4, 6, 7, 10, 11], 6: [0, 1, 3, 6, 8, 9], 7: [2, 3, 5, 8, 10, 11],
    8: [0, 1, 4, 5, 7, 10], 9: [0, 2, 3, 6, 7, 9], 10: [2, 4, 5, 8, 9, 11], 11: [1, 4, 6, 7, 10, 11],
};

const HOUR_NAMES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const HOUR_RANGES = ['23h-1h', '1h-3h', '3h-5h', '5h-7h', '7h-9h', '9h-11h', '11h-13h', '13h-15h', '15h-17h', '17h-19h', '19h-21h', '21h-23h'];
const TWELVE_OFFICERS = ['Kiến', 'Trừ', 'Mãn', 'Bình', 'Định', 'Chấp', 'Phá', 'Nguy', 'Thành', 'Thu', 'Khai', 'Bế'];

const ADVICE_GOOD = ['Cúng tế', 'Cầu phúc', 'Đính hôn', 'Động thổ', 'Ký kết', 'Xuất hành'];
const ADVICE_BAD = ['Kiện tụng', 'An táng', 'Tranh chấp', 'Xây nhà'];

interface CalendarDayDetailProps {
    date: Date;
    onDateChange: (newDate: Date) => void;
}

const CalendarDayDetail: React.FC<CalendarDayDetailProps> = ({ date, onDateChange }) => {

    const details = useMemo(() => {
        const l = lunisolar(date);
        const lunarDay = l.lunar.day;
        const lunarMonth = l.lunar.month;
        const lunarYear = l.lunar.year;
        const isLeap = (l.lunar as any).isLeap;

        const yCan = CAN[((lunarYear - 4) % 10 + 10) % 10];
        const yChi = CHI[((lunarYear - 4) % 12 + 12) % 12];
        const mCan = CAN[((((((lunarYear - 4) % 10 + 10) % 10) % 5) * 2 + 2 + (lunarMonth - 1)) % 10)];
        const mChi = CHI[(lunarMonth + 1) % 12];

        const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
        const y = date.getFullYear() + 4800 - a;
        const m = (date.getMonth() + 1) + 12 * a - 3;
        const jd = date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
        const dCanIdx = (jd + 9) % 10;
        const dChiIdx = (jd + 1) % 12;
        const dayCan = CAN[dCanIdx];
        const dayChi = CHI[dChiIdx];

        const napAm = NAP_AM_MAP[`${dayCan} ${dayChi}`] || "Đang cập nhật";
        const luckyHourIndices = ZODIAC_HOURS_MAP[dChiIdx];
        const conflictGroup = [CHI[(dChiIdx + 6) % 12], CHI[(dChiIdx + 3) % 12], CHI[(dChiIdx + 9) % 12]].join(', ');

        const seed = date.getDate() + date.getMonth();
        const trucName = TWELVE_OFFICERS[seed % 12];

        const dayOfWeek = date.getDay();
        const dayStr = dayOfWeek === 0 ? 'Chủ Nhật' : `Thứ ${dayOfWeek + 1}`;

        return {
            solarDay: date.getDate(),
            solarMonth: date.getMonth() + 1,
            solarYear: date.getFullYear(),
            dayOfWeekStr: dayStr,
            lunarDay,
            lunarMonth,
            lunarYearStr: `${yCan} ${yChi}`,
            canChiMonth: `${mCan} ${mChi}`,
            canChiDay: `${dayCan} ${dayChi}`,
            napAm,
            luckyHourIndices,
            conflictGroup,
            trucName,
            isLeap
        };
    }, [date]);

    return (
        <div className="flex flex-col gap-3 md:gap-6">
            <div className="flex items-center justify-between bg-gray-50 dark:bg-zinc-800 rounded-xl md:rounded-2xl p-3 md:p-4 border border-gray-100 dark:border-zinc-700">
                <div className="flex flex-col items-center flex-1 border-r border-gray-200 dark:border-zinc-700 pr-3 md:pr-4">
                    <span className="text-[9px] md:text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5 md:mb-1">Dương Lịch</span>
                    <span className="text-xs md:text-sm font-bold text-text-secondary dark:text-zinc-400 mb-0.5 md:mb-1">{details.dayOfWeekStr}</span>
                    <span className="text-4xl md:text-5xl font-bold text-text-main dark:text-zinc-100 tracking-tighter leading-none mb-0.5 md:mb-1">{details.solarDay}</span>
                    <span className="text-[10px] md:text-xs text-gray-500 dark:text-zinc-500">Tháng {details.solarMonth}, {details.solarYear}</span>
                </div>

                <div className="flex flex-col items-center flex-1 pl-3 md:pl-4">
                    <span className="text-[9px] md:text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5 md:mb-1">Âm lịch</span>
                    <span className="text-xs md:text-sm font-bold text-accent-red dark:text-red-400 mb-0.5 md:mb-1">{details.lunarYearStr}</span>
                    <span className="text-4xl md:text-5xl font-bold text-text-main dark:text-zinc-100 tracking-tighter leading-none mb-0.5 md:mb-1">{details.lunarDay}</span>
                    <span className="text-[10px] md:text-xs text-gray-500 dark:text-zinc-500">Tháng {details.lunarMonth} {details.isLeap ? '(N)' : ''}, {details.canChiDay}</span>
                </div>
            </div>

            <div className="space-y-2 md:space-y-4">
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-zinc-800 pb-1.5 md:pb-2">
                    <span className="text-xs md:text-sm text-gray-500 dark:text-zinc-400">Mệnh ngày</span>
                    <span className="text-xs md:text-sm font-bold text-text-main dark:text-zinc-200">{details.napAm}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-zinc-800 pb-1.5 md:pb-2">
                    <span className="text-xs md:text-sm text-gray-500 dark:text-zinc-400">Trực</span>
                    <div className="flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-accent-gold"></span>
                        <span className="text-xs md:text-sm font-bold text-text-main dark:text-zinc-200">{details.trucName}</span>
                    </div>
                </div>
                <div className="flex justify-between items-start border-b border-gray-50 dark:border-zinc-800 pb-1.5 md:pb-2">
                    <span className="text-xs md:text-sm text-gray-500 dark:text-zinc-400">Tuổi xung khắc</span>
                    <span className="text-xs md:text-sm font-bold text-text-main dark:text-zinc-200 text-right max-w-[60%]">{details.conflictGroup}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-3">
                <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-2 md:p-3 border border-blue-100/50 dark:border-blue-800/30">
                    <div className="flex items-center gap-1 mb-1.5 md:mb-2">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[14px] md:text-[16px]">check_circle</span>
                        <span className="text-[9px] md:text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase">Nên làm</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {ADVICE_GOOD.slice(0, 3).map((item, i) => (
                            <span key={i} className="text-[9px] md:text-[10px] bg-white dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded shadow-sm border border-blue-100 dark:border-blue-800/30">{item}</span>
                        ))}
                    </div>
                </div>
                <div className="bg-red-50/50 dark:bg-red-900/10 rounded-xl p-2 md:p-3 border border-red-100/50 dark:border-red-800/30">
                    <div className="flex items-center gap-1 mb-1.5 md:mb-2">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[14px] md:text-[16px]">cancel</span>
                        <span className="text-[9px] md:text-[10px] font-bold text-red-700 dark:text-red-400 uppercase">Kiêng kỵ</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {ADVICE_BAD.slice(0, 3).map((item, i) => (
                            <span key={i} className="text-[9px] md:text-[10px] bg-white dark:bg-red-900/30 text-red-800 dark:text-red-200 px-1.5 py-0.5 rounded shadow-sm border border-red-100 dark:border-red-800/30">{item}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <span className="text-[9px] md:text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest block mb-1.5 md:mb-2">GIỜ HOÀNG ĐẠO</span>
                <div className="flex flex-wrap gap-1 md:gap-1.5">
                    {details.luckyHourIndices.map(h => (
                        <div key={h} className="bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 border border-gray-100 dark:border-zinc-700 px-1.5 py-0.5 md:px-2 md:py-1 rounded text-[9px] md:text-[10px] font-bold">
                            {HOUR_NAMES[h]} <span className="font-normal text-gray-400 dark:text-zinc-500">({HOUR_RANGES[h]})</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalendarDayDetail;
