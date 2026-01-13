
import React from 'react';

interface CalendarHeaderProps {
    currentDate: Date;
    isSearchOpen: boolean;
    searchQuery: string;
    isPickerOpen: boolean;
    onTogglePicker: () => void;
    onSetSearchOpen: (open: boolean) => void;
    onSearchQueryChange: (query: string) => void;
    onClearSearch: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
    currentDate,
    isSearchOpen,
    searchQuery,
    isPickerOpen,
    onTogglePicker,
    onSetSearchOpen,
    onSearchQueryChange,
    onClearSearch
}) => {
    return (
        <header className="flex items-center justify-between mb-2 mt-1 h-12 relative">
            {isSearchOpen ? (
                 <div className="flex-1 flex items-center gap-2 animate-[fadeIn_0.2s_ease-out] w-full">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">search</span>
                        <input 
                            autoFocus
                            type="text" 
                            placeholder="Tìm ngày (2/9), sự kiện..."
                            className="w-full bg-white border-2 border-accent-green/50 rounded-full py-1.5 pl-9 pr-8 text-sm focus:outline-none focus:border-accent-green shadow-sm text-text-main placeholder-gray-400"
                            value={searchQuery}
                            onChange={(e) => onSearchQueryChange(e.target.value)}
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => onSearchQueryChange('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                        )}
                    </div>
                    <button 
                        onClick={onClearSearch}
                        className="text-sm font-semibold text-gray-500 hover:text-text-main px-2 whitespace-nowrap"
                    >
                        Hủy
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-2.5 animate-[fadeIn_0.2s_ease-out]">
                        <div className="size-9 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-accent-green text-[20px]">calendar_month</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-text-secondary font-semibold">Lịch Vạn Niên</span>
                            <div 
                                className="flex items-center gap-1 cursor-pointer group select-none"
                                onClick={onTogglePicker}
                            >
                                <span className="text-lg font-bold text-text-main leading-tight group-hover:text-accent-green transition-colors">
                                    Tháng {currentDate.getMonth() + 1}, {currentDate.getFullYear()}
                                </span>
                                <span className={`material-symbols-outlined text-lg text-text-secondary group-hover:text-accent-green transition-transform duration-300 ${isPickerOpen ? 'rotate-180' : ''}`}>expand_more</span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => onSetSearchOpen(true)}
                        className="relative size-9 bg-white hover:bg-gray-50 rounded-full transition-all shadow-sm border border-gray-100/50 flex items-center justify-center animate-[fadeIn_0.2s_ease-out]"
                    >
                        <span className="material-symbols-outlined text-gray-600 text-[20px]">search</span>
                    </button>
                </>
            )}
        </header>
    );
};

export default React.memo(CalendarHeader);
