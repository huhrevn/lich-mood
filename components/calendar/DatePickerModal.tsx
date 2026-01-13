
import React, { useState, useRef, useEffect } from 'react';

interface DatePickerModalProps {
    isOpen: boolean;
    currentYear: number;
    currentMonth: number;
    onClose: () => void;
    onSelect: (year: number, month: number) => void;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({ isOpen, currentYear, currentMonth, onClose, onSelect }) => {
    const [pickerYear, setPickerYear] = useState(currentYear);
    const [isSelectingYear, setIsSelectingYear] = useState(false);
    const yearListRef = useRef<HTMLDivElement>(null);

    // Sync state when modal opens
    useEffect(() => {
        if (isOpen) {
            setPickerYear(currentYear);
            setIsSelectingYear(false);
        }
    }, [isOpen, currentYear]);

    // Scroll to year logic
    useEffect(() => {
        if (isSelectingYear && yearListRef.current) {
            const selectedBtn = yearListRef.current.querySelector('[data-selected="true"]');
            if (selectedBtn) {
                selectedBtn.scrollIntoView({ block: 'center' });
            }
        }
    }, [isSelectingYear]);

    if (!isOpen) return null;

    const years = Array.from({ length: 201 }, (_, i) => 1900 + i);

    return (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-32 px-4">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative z-10 animate-[slideUp_0.2s_ease-out]">
                <div className="bg-accent-green p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg">{isSelectingYear ? 'Chọn Năm' : 'Chọn Tháng'}</h3>
                    <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="p-5">
                    {/* Controls */}
                    <div className="flex items-center justify-between mb-6 bg-gray-50 rounded-2xl p-2 border border-gray-100">
                        <button onClick={() => setPickerYear(p => p - 1)} className="size-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-text-main hover:text-accent-green active:scale-95 transition-all">
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        
                        <button 
                            onClick={() => setIsSelectingYear(!isSelectingYear)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                        >
                            <span className="text-2xl font-bold text-accent-green tabular-nums">{pickerYear}</span>
                            <span className={`material-symbols-outlined text-accent-green transition-transform duration-300 ${isSelectingYear ? 'rotate-180' : ''}`}>arrow_drop_down</span>
                        </button>

                        <button onClick={() => setPickerYear(p => p + 1)} className="size-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-text-main hover:text-accent-green active:scale-95 transition-all">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>

                    {/* CONTENT */}
                    {isSelectingYear ? (
                        <div className="max-h-[280px] overflow-y-auto no-scrollbar pr-1 relative" ref={yearListRef}>
                            <div className="grid grid-cols-4 gap-3">
                                {years.map((year) => {
                                    const isSelected = year === pickerYear;
                                    return (
                                        <button
                                            key={year}
                                            data-selected={isSelected}
                                            onClick={() => {
                                                setPickerYear(year);
                                                setIsSelectingYear(false);
                                            }}
                                            className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                                                isSelected 
                                                ? 'bg-accent-green text-white border-accent-green shadow-glow' 
                                                : 'bg-white text-text-main border-gray-100 hover:border-accent-green hover:text-accent-green hover:bg-green-50'
                                            }`}
                                        >
                                            {year}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            {Array.from({ length: 12 }).map((_, i) => {
                                const isSelected = currentMonth === i && currentYear === pickerYear;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => onSelect(pickerYear, i)}
                                        className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                                            isSelected 
                                            ? 'bg-accent-green text-white border-accent-green shadow-glow' 
                                            : 'bg-white text-text-main border-gray-100 hover:border-accent-green hover:text-accent-green hover:bg-green-50'
                                        }`}
                                    >
                                        Tháng {i + 1}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {!isSelectingYear && (
                        <button 
                            onClick={() => onSelect(new Date().getFullYear(), new Date().getMonth())}
                            className="w-full mt-6 py-3 rounded-xl bg-gray-100 text-text-secondary text-sm font-bold hover:bg-gray-200 transition-colors"
                        >
                            Quay về hiện tại
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DatePickerModal;
