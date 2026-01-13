
import React from 'react';
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
    const leapLabel = (isResultLunar && result.isLeap) ? '(Nhuận)' : '';
    const displayCanChi = isResultLunar 
        ? `${result.canChiDay} - ${result.canChiMonth}`
        : ''; // Only show detailed Can Chi for Lunar Result? Or both? Actually Lunar result is usually the destination.

    return (
        <div className="w-full flex flex-col items-center justify-center text-center">
            {/* Big Number */}
            <span className="text-[6rem] lg:text-[7rem] leading-none font-bold text-[#111827] dark:text-white tracking-tighter tabular-nums drop-shadow-sm my-2">
                {displayDay}
            </span>
            
            {/* Month/Year Capsule */}
            <div className="flex items-center justify-center gap-3 bg-gray-50 dark:bg-zinc-800 px-6 py-2.5 rounded-full border border-gray-100 dark:border-zinc-700 mt-2 shadow-sm">
                <span className="text-base font-bold text-[#4A7B4F]">
                    Tháng {displayMonth} {leapLabel}
                </span>
                <span className="size-1.5 bg-gray-300 dark:bg-zinc-600 rounded-full"></span>
                <span className="text-base font-bold text-gray-600 dark:text-zinc-400">
                    Năm {displayYear}
                </span>
            </div>

            {/* Extra Info (Can Chi) */}
            {isResultLunar && (
                <div className="mt-4 text-sm font-medium text-gray-500 dark:text-zinc-500">
                    {result.canChiDay}, {result.canChiYear}
                </div>
            )}
        </div>
    );
};

export default React.memo(ConverterResult);
