
import React, { useMemo } from 'react';
import { ConversionResult, ConversionMode } from '../../types/converterTypes';

interface ConverterResultProps {
    result: ConversionResult;
    mode: ConversionMode;
}

const ConverterResult: React.FC<ConverterResultProps> = ({ result, mode }) => {
    // Determine what to display based on output mode
    const isResultLunar = mode === 'SOLAR_TO_LUNAR';

    // Format Display Data
    const displayDay = isResultLunar ? result.lunarDay : result.date.getDate();
    const displayMonth = isResultLunar ? result.lunarMonth : result.date.getMonth() + 1;
    const displayYear = isResultLunar ? result.lunarYear : result.date.getFullYear();
    const leapLabel = isResultLunar && result.isLeap ? '(Nhuận)' : '';

    // Random Accents for Focal Point
    const accents = [
        { text: 'text-accent-green', glow: 'bg-accent-green/5', glowHover: 'group-hover:bg-accent-green/10', border: 'border-accent-green/10', bg: 'bg-accent-green/5' },
        { text: 'text-blue-500', glow: 'bg-blue-500/5', glowHover: 'group-hover:bg-blue-500/10', border: 'border-blue-500/10', bg: 'bg-blue-500/5' },
        { text: 'text-purple-500', glow: 'bg-purple-500/5', glowHover: 'group-hover:bg-purple-500/10', border: 'border-purple-500/10', bg: 'bg-purple-500/5' },
        { text: 'text-orange-500', glow: 'bg-orange-500/5', glowHover: 'group-hover:bg-orange-500/10', border: 'border-orange-500/10', bg: 'bg-orange-500/5' },
        { text: 'text-rose-500', glow: 'bg-rose-500/5', glowHover: 'group-hover:bg-rose-500/10', border: 'border-rose-500/10', bg: 'bg-rose-500/5' },
        { text: 'text-teal-500', glow: 'bg-teal-500/5', glowHover: 'group-hover:bg-teal-500/10', border: 'border-teal-500/10', bg: 'bg-teal-500/5' },
    ];

    // Special Colors for Weekends
    const satAccent = { text: 'text-red-500', glow: 'bg-red-500/10', glowHover: 'group-hover:bg-red-500/20', border: 'border-red-500/20', bg: 'bg-red-500/10' };
    const sunAccent = { text: 'text-red-700', glow: 'bg-red-700/10', glowHover: 'group-hover:bg-red-700/20', border: 'border-red-700/20', bg: 'bg-red-700/10' };

    // Selection Logic: Weekend Priority then Deterministic Random
    const accent = useMemo(() => {
        const dayOfWeek = result.date.getDay(); // 0: Sunday, 6: Saturday
        if (dayOfWeek === 0) return sunAccent;
        if (dayOfWeek === 6) return satAccent;
        return accents[Number(displayDay) % accents.length];
    }, [displayDay, result.date, accents]);

    return (
        <div className="w-full flex flex-col items-center justify-center text-center animate-[fadeIn_0.3s_ease-out]">
            {/* Header Title */}
            <div className="text-[10px] md:text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-1">
                {isResultLunar ? 'Kết quả Âm Lịch' : 'Kết quả Dương Lịch'}
            </div>

            {/* Big Main Number with Month - Redesigned for Impact */}
            <div className="flex items-center justify-center gap-4 md:gap-6 mb-2">
                <div className="relative group">
                    <span className={`text-[6rem] md:text-[7.5rem] lg:text-[9rem] leading-none font-black ${accent.text} tracking-tighter tabular-nums drop-shadow-xl select-none`}>
                        {displayDay}
                    </span>
                    {/* Subtle Highlight Glow */}
                    <div className={`absolute inset-0 ${accent.glow} blur-3xl -z-10 rounded-full scale-150 ${accent.glowHover} transition-colors`}></div>
                </div>

                {/* Stylish Tilted Separator */}
                <div className="h-16 md:h-24 w-[2px] bg-gray-200 dark:bg-zinc-800 rotate-[15deg] mx-1 md:mx-2 rounded-full"></div>

                <div className="flex flex-col items-start mt-4 md:mt-6">
                    <span className="text-[10px] md:text-[11px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-[0.2em] mb-1">Tháng</span>
                    <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-600 dark:text-zinc-400 tabular-nums leading-none tracking-tight">
                        {displayMonth}
                        {leapLabel && <span className={`text-xs md:text-sm ml-1.5 font-bold ${accent.text} ${accent.bg} px-1.5 py-0.5 rounded-md uppercase align-middle`}>{leapLabel}</span>}
                    </span>
                </div>
            </div>

            {/* Year Info with polished styling */}
            <div className="flex flex-col items-center mb-6">
                <div className={`h-[2px] w-8 ${accent.bg} rounded-full mb-3`}></div>
                <div className="text-lg md:text-xl font-bold text-gray-800 dark:text-zinc-100 drop-shadow-sm flex items-center gap-2">
                    <span className="text-gray-400 font-medium">Năm</span>
                    {result.canChiYear}
                    <span className="text-xs bg-gray-100 dark:bg-zinc-800 text-gray-500 px-2 py-0.5 rounded-full font-bold ml-1">{displayYear}</span>
                </div>
            </div>

            {/* Detailed Capsule (Can Chi Day & Month) */}
            <div className={`${accent.bg} border ${accent.border} px-6 py-2 rounded-full shadow-sm hover:translate-y-[-1px] transition-all cursor-default`}>
                <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                    <span className={`text-xs md:text-sm font-bold ${accent.text} uppercase tracking-widest`}>
                        NGÀY {result.canChiDay}
                    </span>
                    <span className={`w-1.5 h-1.5 rounded-full ${accent.text} opacity-20`}></span>
                    <span className={`text-xs md:text-sm font-bold ${accent.text} uppercase tracking-widest`}>
                        THÁNG {result.canChiMonth}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ConverterResult);
