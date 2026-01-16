
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { ConversionMode } from '../../types/converterTypes';
import { LunarMonthData } from '../../utils/lunarDataGenerator';

interface ConverterFormProps {
    mode: ConversionMode;
    setMode: (mode: ConversionMode) => void;
    // Solar Props
    solarDay: string; setSolarDay: (v: string) => void;
    solarMonth: string; setSolarMonth: (v: string) => void;
    solarYear: string; setSolarYear: (v: string) => void;

    // Lunar Props
    lunarYearStr: string; setLunarYearStr: (v: string) => void;
    selectedLunarMonthKey: string; setSelectedLunarMonthKey: (v: string) => void;
    selectedLunarDay: number; setSelectedLunarDay: (v: number) => void;
    lunarMonthOptions: LunarMonthData[];
    maxLunarDays: number;

    error: string | null;
    onReset?: () => void;
}

// Helper: Custom Select/Input for Desktop - Optimized Light Theme
const DesktopInputBox: React.FC<{
    label: string;
    value: string | number;
    options?: { label: string | number; value: string | number }[];
    onChange: (val: any) => void;
    type?: 'select' | 'text' | 'number';
    placeholder?: string;
    className?: string;
}> = ({ label, value, options, onChange, type = 'select', placeholder, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Handle Click Outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Auto-scroll to selected option
    useEffect(() => {
        if (isOpen && listRef.current) {
            const selectedEl = listRef.current.querySelector('[data-selected="true"]');
            if (selectedEl) {
                selectedEl.scrollIntoView({ block: 'center' });
            }
        }
    }, [isOpen]);

    const selectedLabel = options?.find(o => String(o.value) === String(value))?.label || value;

    return (
        <div ref={containerRef} className={`flex flex-col relative ${className}`}>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 pl-1 select-none">{label}</label>

            <div
                className={`relative w-full h-12 bg-white dark:bg-zinc-800 border rounded-xl transition-all duration-200 flex items-center shadow-sm cursor-pointer
                ${isOpen
                        ? 'border-accent-green ring-4 ring-accent-green/10 z-20'
                        : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'}`}
                onClick={() => type === 'select' && setIsOpen(!isOpen)}
            >
                {type === 'select' && options ? (
                    <>
                        <div className="flex items-center justify-between w-full px-3 h-full">
                            <span className="text-xs font-bold text-gray-800 dark:text-zinc-100 truncate mr-2 select-none">
                                {selectedLabel}
                            </span>
                            <span className={`material-symbols-outlined text-gray-400 text-[22px] transition-transform duration-200 ${isOpen ? 'rotate-180 text-accent-green' : ''}`}>arrow_drop_down</span>
                        </div>

                        {/* Custom Dropdown Menu - Light Theme Optimized */}
                        {isOpen && (
                            <div
                                className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-700 z-50 overflow-hidden animate-[fadeIn_0.1s_ease-out]"
                            >
                                <div
                                    ref={listRef}
                                    className="max-h-[280px] overflow-y-auto overflow-x-hidden p-1 custom-scrollbar"
                                >
                                    {options.map((opt) => {
                                        const isSelected = String(opt.value) === String(value);
                                        return (
                                            <div
                                                key={opt.value}
                                                data-selected={isSelected}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onChange(opt.value);
                                                    setIsOpen(false);
                                                }}
                                                className={`px-3 py-2.5 text-sm cursor-pointer transition-all flex items-center justify-between rounded-lg mb-0.5 last:mb-0 ${isSelected
                                                    ? 'bg-accent-green/10 text-accent-green font-bold'
                                                    : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700'
                                                    }`}
                                            >
                                                <span className="truncate">{opt.label}</span>
                                                {isSelected && (
                                                    <span className="material-symbols-outlined text-[18px]">check</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <input
                        type="number"
                        inputMode="numeric"
                        className="w-full h-full bg-transparent px-3 text-xs font-bold text-gray-800 dark:text-zinc-100 outline-none placeholder-gray-400 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none rounded-xl"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        onFocus={(e) => e.target.parentElement?.classList.add('border-accent-green', 'ring-4', 'ring-accent-green/10')}
                        onBlur={(e) => !isOpen && e.target.parentElement?.classList.remove('border-accent-green', 'ring-4', 'ring-accent-green/10')}
                    />
                )}
            </div>
        </div>
    );
};

// --- MOBILE SELECT COMPONENT (Legacy - Preserved for responsiveness) ---
interface SelectOption {
    label: string | number;
    value: string | number;
}

interface CustomSelectProps {
    label: string;
    value: string | number;
    options: SelectOption[];
    onChange: (val: any) => void;
    className?: string;
    flex?: number;
    onReset?: () => void;
    onSwap?: () => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, value, options, onChange, className, flex, onReset, onSwap }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && listRef.current) {
            const selectedEl = listRef.current.querySelector('[data-selected="true"]');
            if (selectedEl) {
                selectedEl.scrollIntoView({ block: 'center' });
            }
        }
    }, [isOpen]);

    const selectedOption = options.find(o => o.value === value);
    const displayLabel = selectedOption ? selectedOption.label : value;

    return (
        <div
            className={`relative ${className || ''}`}
            ref={containerRef}
            style={flex ? { flex: flex, minWidth: 0 } : {}}
        >
            <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5 block text-center">{label}</label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-11 md:h-12 rounded-2xl px-3 text-sm font-bold flex items-center justify-between transition-all shadow-sm ${isOpen
                    ? 'bg-white dark:bg-zinc-900 border border-accent-green ring-4 ring-accent-green/10 text-gray-900 dark:text-zinc-100'
                    : 'bg-gray-50 dark:bg-zinc-800 border border-transparent dark:border-zinc-700 text-gray-900 dark:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-700'
                    }`}
            >
                <div className="flex-1 text-center truncate text-xs">
                    {displayLabel}
                </div>
                <span className={`material-symbols-outlined text-gray-400 text-[20px] absolute right-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>arrow_drop_down</span>
            </button>

            {isOpen && (
                <div
                    className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-700 z-[60] flex flex-col overflow-hidden animate-[fadeIn_0.1s_ease-out]"
                >
                    <div
                        ref={listRef}
                        className="max-h-[240px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full p-1"
                    >
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                data-selected={opt.value === value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-center px-2 py-2.5 text-sm transition-colors rounded-xl mb-0.5 last:mb-0 ${opt.value === value
                                    ? 'bg-accent-green/10 text-accent-green font-bold'
                                    : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    {(onReset || onSwap) && (
                        <div className="border-t border-gray-100 dark:border-zinc-800 bg-gray-50/80 dark:bg-zinc-800/80 backdrop-blur p-2 flex items-center justify-between gap-2">
                            {onReset && (
                                <button
                                    onClick={() => { onReset(); setIsOpen(false); }}
                                    className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-600 dark:text-zinc-400 hover:text-accent-green bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 hover:border-accent-green rounded-lg py-2 transition-all shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                                    Hôm nay
                                </button>
                            )}
                            {onSwap && (
                                <button
                                    onClick={() => { onSwap(); setIsOpen(false); }}
                                    className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-600 dark:text-zinc-400 hover:text-accent-green bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 hover:border-accent-green rounded-lg py-2 transition-all shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                                    Đổi chiều
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ConverterForm: React.FC<ConverterFormProps> = ({
    mode, setMode,
    solarDay, setSolarDay, solarMonth, setSolarMonth, solarYear, setSolarYear,
    lunarYearStr, setLunarYearStr, selectedLunarMonthKey, setSelectedLunarMonthKey, selectedLunarDay, setSelectedLunarDay,
    lunarMonthOptions, maxLunarDays,
    error,
    onReset
}) => {
    const isSolarInput = mode === 'SOLAR_TO_LUNAR';

    const handleSolarChange = (setter: (v: string) => void, maxVal: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === '') { setter(''); return; }
        const num = parseInt(val, 10);
        if (!isNaN(num) && (maxVal === 0 || (num >= 1 && num <= maxVal))) {
            setter(val);
        }
    };

    const handleSwap = () => {
        setMode(mode === 'SOLAR_TO_LUNAR' ? 'LUNAR_TO_SOLAR' : 'SOLAR_TO_LUNAR');
    };

    // --- DATA PREP ---
    const dayOptions = useMemo(() => Array.from({ length: 31 }, (_, i) => ({ label: i + 1, value: i + 1 })), []);
    const monthOptions = useMemo(() => Array.from({ length: 12 }, (_, i) => ({ label: `Tháng ${i + 1}`, value: i + 1 })), []);

    // Lunar specific
    const lunarDayOptions = useMemo(() => Array.from({ length: maxLunarDays }, (_, i) => ({ label: i + 1, value: i + 1 })), [maxLunarDays]);
    const lunarMonthSelectOptions = useMemo(() => lunarMonthOptions.map(opt => ({
        label: opt.label,
        value: opt.value
    })), [lunarMonthOptions]);

    // Year options (Common range: 1900-2100)
    const yearOptions = useMemo(() => Array.from({ length: 201 }, (_, i) => {
        const year = 1900 + i;
        return { label: String(year), value: String(year) };
    }), []);

    const baseInputClass = "w-full h-11 md:h-12 rounded-2xl px-3 font-bold text-center text-lg bg-gray-50 dark:bg-zinc-800 border border-transparent dark:border-zinc-700 text-gray-900 dark:text-zinc-100 placeholder-gray-400 focus:bg-white dark:focus:bg-zinc-900 focus:border-accent-green focus:ring-4 focus:ring-accent-green/10 focus:outline-none transition-all shadow-sm tabular-nums disabled:opacity-50 appearance-none";
    const labelClass = "text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5 block text-center";

    return (
        <div className="w-full flex flex-col h-full">

            {/* 1. TABS: Hidden on Desktop (Moved to Screen level) or styled differently */}
            <div className="pb-0 xl:hidden">
                <div className="bg-gray-100 dark:bg-zinc-800 p-1.5 rounded-2xl flex relative h-12">
                    {/* Active Indicator Slide */}
                    <div
                        className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-accent-green shadow-lg shadow-accent-green/30 rounded-[10px] transition-all duration-300 ease-in-out z-0 ${isSolarInput ? 'left-1.5' : 'left-[calc(50%+3px)]'
                            }`}
                    ></div>
                    <button
                        onClick={() => setMode('SOLAR_TO_LUNAR')}
                        className={`relative z-10 flex-1 h-full text-[11px] font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${isSolarInput
                            ? 'text-white'
                            : 'text-gray-400 dark:text-zinc-500'
                            }`}
                    >
                        <span className={`material-symbols-outlined text-[16px] ${isSolarInput ? 'text-white' : 'text-gray-400 dark:text-zinc-600'}`}>wb_sunny</span>
                        Sang Âm
                    </button>
                    <button
                        onClick={() => setMode('LUNAR_TO_SOLAR')}
                        className={`relative z-10 flex-1 h-full text-[11px] font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${!isSolarInput
                            ? 'text-white'
                            : 'text-gray-400 dark:text-zinc-500'
                            }`}
                    >
                        <span className={`material-symbols-outlined text-[16px] ${!isSolarInput ? 'text-white' : 'text-gray-400 dark:text-zinc-600'}`}>dark_mode</span>
                        Sang Dương
                    </button>
                </div>
            </div>

            {/* 2. Inputs Area */}
            <div className="flex-1 flex flex-col">
                {/* Mobile Title */}
                <div className="flex xl:hidden items-center justify-center mb-3">
                    <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                        <span className={`material-symbols-outlined text-[16px] ${isSolarInput ? 'text-orange-500' : 'text-indigo-500'}`}>
                            {isSolarInput ? 'wb_sunny' : 'dark_mode'}
                        </span>
                        {isSolarInput ? 'Nhập Dương Lịch' : 'Nhập Âm Lịch'}
                    </span>
                </div>

                {/* Desktop Title (Red Accent for Solar/Lunar Input) */}
                <div className="hidden xl:flex items-center justify-between mb-6">
                    <span className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${isSolarInput ? 'text-orange-600' : 'text-indigo-600'}`}>
                        <span className="material-symbols-outlined text-[20px] filled-icon">
                            {isSolarInput ? 'wb_sunny' : 'dark_mode'}
                        </span>
                        {isSolarInput ? 'CHỌN NGÀY DƯƠNG LỊCH' : 'CHỌN NGÀY ÂM LỊCH'}
                    </span>
                </div>

                {/* ==================== MOBILE LAYOUT (<1280px) ==================== */}
                <div className="xl:hidden space-y-3">
                    {isSolarInput ? (
                        <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-3">
                                <CustomSelect label="Ngày" value={parseInt(solarDay) || 1} onChange={(val) => setSolarDay(String(val))} options={dayOptions} />
                            </div>
                            <div className="col-span-4">
                                <CustomSelect label="Tháng" value={parseInt(solarMonth) || 1} onChange={(val) => setSolarMonth(String(val))} options={monthOptions} />
                            </div>
                            <div className="col-span-5">
                                <CustomSelect label="Năm" value={solarYear} onChange={setSolarYear} options={yearOptions} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <div className="w-[19%] min-w-[62px] max-w-[70px]">
                                <CustomSelect label="Ngày" value={selectedLunarDay} onChange={(val) => setSelectedLunarDay(Number(val))} options={lunarDayOptions} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <CustomSelect label="Tháng" value={selectedLunarMonthKey} onChange={(val) => setSelectedLunarMonthKey(String(val))} options={lunarMonthSelectOptions} onReset={onReset} onSwap={handleSwap} />
                            </div>
                            <div className="w-[28%] min-w-[76px] max-w-[100px]">
                                <CustomSelect label="Năm" value={lunarYearStr} onChange={setLunarYearStr} options={yearOptions} />
                            </div>
                        </div>
                    )}
                </div>

                {/* ==================== DESKTOP LAYOUT (>=1280px) ==================== */}
                {/* 
                    OPTIMIZED 3-COLUMN LAYOUT FOR DESKTOP 
                    Uses DesktopInputBox for clean, bordered look with native selects.
                */}
                <div className="hidden xl:grid grid-cols-3 gap-3 flex-1 items-start">
                    {isSolarInput ? (
                        <>
                            <DesktopInputBox
                                label="NGÀY"
                                value={parseInt(solarDay) || 1}
                                onChange={(val) => setSolarDay(String(val))}
                                options={dayOptions}
                            />
                            <DesktopInputBox
                                label="THÁNG"
                                value={parseInt(solarMonth) || 1}
                                onChange={(val) => setSolarMonth(String(val))}
                                options={monthOptions}
                            />
                            <DesktopInputBox
                                label="NĂM"
                                value={solarYear}
                                onChange={(val) => setSolarYear(String(val))}
                                options={yearOptions}
                            />
                        </>
                    ) : (
                        <>
                            <DesktopInputBox
                                label="NGÀY ÂM"
                                value={selectedLunarDay}
                                onChange={(val) => setSelectedLunarDay(Number(val))}
                                options={lunarDayOptions}
                            />
                            <DesktopInputBox
                                label="THÁNG ÂM"
                                value={selectedLunarMonthKey}
                                onChange={(val) => setSelectedLunarMonthKey(String(val))}
                                options={lunarMonthSelectOptions}
                            />
                            <DesktopInputBox
                                label="NĂM ÂM"
                                value={lunarYearStr}
                                onChange={(val) => setLunarYearStr(String(val))}
                                options={yearOptions}
                            />
                        </>
                    )}
                </div>

                {/* Swap Divider (Mobile Only - Desktop moves this to center col in ConverterScreen layout) */}
                <div className="relative py-4 flex justify-center xl:hidden">
                    <button onClick={handleSwap} className="flex items-center justify-center size-10 rounded-full border border-gray-100 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 hover:text-accent-green active:scale-90 transition-all" title="Đổi chiều">
                        <span className="material-symbols-outlined text-[20px]">swap_vert</span>
                    </button>
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-[fadeIn_0.3s_ease-out] mt-auto xl:mt-4">
                        <p className="text-xs text-red-700 font-semibold flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            {error}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(ConverterForm);
