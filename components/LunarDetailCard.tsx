
import React, { useMemo } from 'react';
import lunisolar from 'lunisolar';
import { CAN, CHI, HOUR_NAMES, HOUR_RANGES, NAP_AM_MAP, ZODIAC_DAYS_MAP, ZODIAC_HOURS_MAP } from '../constants/converterConstants';
import { useLanguage } from '../contexts/LanguageContext';

const getJulianDay = (date: Date): number => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
};

interface LunarDetailCardProps {
    date: Date;
    onDateChange: (newDate: Date) => void;
}

const LunarDetailCard: React.FC<LunarDetailCardProps> = ({ date, onDateChange }) => {
    const { t, language } = useLanguage();
    
    const details = useMemo(() => {
        // Force GMT+7 Logic
        const l = lunisolar(date);
        
        const lunarDay = l.lunar.day;
        const lunarMonth = l.lunar.month;
        const lunarYear = l.lunar.year;
        
        const isLeap = (l.lunar as any).isLeap;

        let yCanIdx = (lunarYear - 4) % 10; if (yCanIdx < 0) yCanIdx += 10;
        let yChiIdx = (lunarYear - 4) % 12; if (yChiIdx < 0) yChiIdx += 12;
        const yearCan = CAN[yCanIdx];
        const yearChi = CHI[yChiIdx];

        const baseMonthCan = ((yCanIdx % 5) * 2 + 2) % 10; 
        const mCanIdx = (baseMonthCan + (lunarMonth - 1)) % 10;
        const mChiIdx = (lunarMonth + 1) % 12; 
        const monthCan = CAN[mCanIdx];
        const monthChi = CHI[mChiIdx];

        const jd = getJulianDay(date);
        const dCanIdx = (jd + 9) % 10;
        const dChiIdx = (jd + 1) % 12;
        const dayCan = CAN[dCanIdx];
        const dayChi = CHI[dChiIdx];

        const canChiKey = `${dayCan} ${dayChi}`;
        const napAm = NAP_AM_MAP[canChiKey] || t('home.updating');

        const goodDays = ZODIAC_DAYS_MAP[lunarMonth] || [];
        const isZodiacDay = goodDays.includes(dChiIdx);

        const luckyHourIndices = ZODIAC_HOURS_MAP[dChiIdx];
        const conflictChiIdx = (dChiIdx + 6) % 12;
        const conflictGroup = [CHI[conflictChiIdx], CHI[(dChiIdx + 3) % 12], CHI[(dChiIdx + 9) % 12]].join(', ');

        const dayOfWeek = date.getDay();
        // Use english day names if EN
        const daysVI = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        const daysEN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeekStr = language === 'en' ? daysEN[dayOfWeek] : daysVI[dayOfWeek];

        return {
            solarDay: date.getDate(),
            solarMonth: date.getMonth() + 1,
            solarYear: date.getFullYear(),
            dayOfWeek, // 0 = Sunday, 6 = Saturday
            dayOfWeekStr,
            lunarDay,
            lunarMonth,
            canChiYear: `${yearCan} ${yearChi}`,
            canChiMonth: `${monthCan} ${monthChi}`,
            canChiDay: `${dayCan} ${dayChi}`,
            isLeap, // Expose Leap Data
            napAm,
            isZodiacDay,
            luckyHourIndices,
            conflictGroup
        };
    }, [date, language, t]);

    const handlePrev = () => {
        const d = new Date(date);
        d.setDate(d.getDate() - 1);
        onDateChange(d);
    };

    const handleNext = () => {
        const d = new Date(date);
        d.setDate(d.getDate() + 1);
        onDateChange(d);
    };

    const handleToday = () => {
        onDateChange(new Date());
    };

    return (
        <div className="bg-bg-surface dark:bg-zinc-900 rounded-[24px] shadow-card dark:shadow-none border border-transparent dark:border-zinc-800 overflow-hidden relative transition-colors">
            
            {/* Today Button - Centered at Top */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30">
                <button 
                    onClick={handleToday}
                    className="px-3 py-1 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm rounded-full text-[10px] font-bold text-accent-green hover:bg-accent-green hover:text-white transition-all uppercase tracking-wide"
                >
                    {t('common.today')}
                </button>
            </div>

            {/* Split Header - Compact Padding */}
            <div className="p-4 pb-4 relative pt-9">
                 {/* Navigation Arrows (Absolute) - Smaller Size */}
                 <button onClick={handlePrev} className="absolute left-1 top-1/2 mt-2 -translate-y-1/2 size-8 rounded-full bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm flex items-center justify-center text-text-secondary hover:text-accent-green hover:shadow-md transition-all z-20">
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button onClick={handleNext} className="absolute right-1 top-1/2 mt-2 -translate-y-1/2 size-8 rounded-full bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm flex items-center justify-center text-text-secondary hover:text-accent-green hover:shadow-md transition-all z-20">
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>

                <div className="flex items-stretch justify-between px-1">
                    {/* Solar - Left */}
                    <div className="flex-1 flex flex-col items-center justify-start border-r border-gray-100 dark:border-zinc-800 py-1 pr-1">
                        <span className="text-xs sm:text-sm font-semibold text-text-main mb-0.5">{t('home.solar')}</span>
                        
                        {/* Weekday Badge */}
                        <span className={`bg-gray-100 dark:bg-zinc-800 text-[10px] font-bold px-2 py-0.5 rounded-full mb-0.5 ${
                            (details.dayOfWeek === 0 || details.dayOfWeek === 6) ? 'text-sunday-red' : 'text-text-secondary'
                        }`}>
                            {details.dayOfWeekStr}
                        </span>

                        <span className="text-6xl sm:text-[4.5rem] md:text-[5rem] leading-none font-bold text-accent-green tracking-tighter my-0.5">
                            {details.solarDay}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-text-secondary text-center">
                            {t('home.month')} {String(details.solarMonth).padStart(2, '0')} {t('home.year')} {details.solarYear}
                        </span>
                    </div>

                    {/* Lunar - Right */}
                    <div className="flex-1 flex flex-col items-center justify-start py-1 pl-1">
                        <span className="text-xs sm:text-sm font-semibold text-text-main mb-0.5">{t('home.lunar')}</span>
                        <div className="flex items-center gap-2 mt-4 sm:mt-5 mb-0.5">
                            <span className="text-6xl sm:text-[4.5rem] md:text-[5rem] leading-none font-bold text-accent-green tracking-tighter">
                                {details.lunarDay}
                            </span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-0.5">
                            <span className="text-xs sm:text-sm font-medium text-text-secondary">
                                {t('home.month')} {details.lunarMonth} {details.isLeap ? t('home.leap') : ''} {t('home.year')} {details.canChiYear}
                            </span>
                            <span className="text-[10px] sm:text-xs font-bold text-accent-red leading-tight px-1 text-center">
                                {language === 'en' ? `${details.canChiDay} - ${details.canChiMonth}` : `Ngày ${details.canChiDay} - Tháng ${details.canChiMonth}`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Info - Compact Spacing */}
            <div className="pt-3 pb-4 px-4 border-t border-gray-100 dark:border-zinc-800 flex flex-col gap-2">
                <div className="flex items-start text-xs sm:text-sm">
                    <span className="font-bold text-text-main min-w-[85px] sm:min-w-[100px] shrink-0">{t('home.day_fate')}:</span>
                    <span className="text-text-secondary">
                        {details.napAm} - <span className={details.isZodiacDay ? 'text-text-main font-bold' : 'text-text-secondary'}>
                            {details.isZodiacDay ? t('home.zodiac_day') : t('home.black_day')}
                        </span>
                    </span>
                </div>

                <div className="flex items-start text-xs sm:text-sm">
                    <span className="font-bold text-text-main min-w-[85px] sm:min-w-[100px] shrink-0">{t('home.lucky_hours')}:</span>
                    <span className="text-text-secondary leading-relaxed">
                        {details.luckyHourIndices.map((h, i) => (
                            <React.Fragment key={h}>
                                <span className="text-accent-green font-semibold">{HOUR_NAMES[h]}</span> <span className="text-gray-400 dark:text-zinc-500 text-[10px] sm:text-xs">{HOUR_RANGES[h]}</span>
                                {i < details.luckyHourIndices.length - 1 && ', '}
                            </React.Fragment>
                        ))}
                    </span>
                </div>

                <div className="flex items-start text-xs sm:text-sm">
                    <span className="font-bold text-text-main min-w-[85px] sm:min-w-[100px] shrink-0">{t('home.conflict_age')}:</span>
                    <span className="text-text-secondary">{details.conflictGroup}</span>
                </div>
            </div>
        </div>
    );
};

export default LunarDetailCard;
