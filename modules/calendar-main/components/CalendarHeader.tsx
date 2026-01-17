
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useTheme } from '../../../contexts/ThemeContext';

interface UserProfile {
    name: string;
    avatar: string;
}

interface CalendarHeaderProps {
    user: UserProfile;
    greeting: string;
    currentTime: Date;
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
    onClearSearch: () => void;
}

// ... 

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
    user, greeting, currentTime,
    searchQuery, onSearchQueryChange, onClearSearch
}) => {
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const { t } = useLanguage();

    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark'; // Map context theme to isDark boolean for existing UI logic
    const toggleDarkMode = toggleTheme; // Alias for compatibility
    const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
    // END: Using ThemeContext instead of local logic

    const displayGreeting = greeting === 'Xin chào' ? t('home.greeting') : greeting;

    return (
        <header className="sticky top-0 z-50 bg-bg-base/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-transparent dark:border-zinc-800 transition-all px-4 md:px-0 py-3 md:hidden">
            {/* MOBILE LAYOUT */}
            <div className={`flex md:hidden flex-col gap-3 ${isMobileSearchVisible ? 'pb-2' : ''}`}>
                <div className="flex items-center justify-between gap-4">
                    {!isMobileSearchVisible && (
                        <div className="flex items-center gap-3 animate-[fadeIn_0.2s_ease-out]">
                            <div className="size-9 rounded-full overflow-hidden border border-gray-200 dark:border-zinc-700 shadow-sm">
                                <img src={user.avatar} className="w-full h-full object-cover" alt="User" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-[10px] uppercase tracking-widest text-accent-green font-bold leading-none mb-0.5">{displayGreeting}</span>
                                <span className="text-sm font-bold text-text-main leading-none">{user.name}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2 ml-auto">
                        {!isMobileSearchVisible && (
                            <button
                                onClick={() => setIsMobileSearchVisible(true)}
                                className="size-8 flex items-center justify-center bg-gray-50 dark:bg-zinc-900 rounded-full text-gray-500 animate-[fadeIn_0.2s_ease-out]"
                            >
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </button>
                        )}

                        <span className="text-lg font-bold text-accent-green tracking-tight tabular-nums px-1">
                            {hours}:{minutes}
                        </span>

                        {!isMobileSearchVisible && (
                            <button
                                onClick={toggleDarkMode}
                                className="size-8 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-full shadow-sm border border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 animate-[fadeIn_0.2s_ease-out]"
                            >
                                <span className={`material-symbols-outlined text-[18px] ${isDark ? 'rotate-[360deg]' : ''} transition-transform duration-500`}>
                                    {isDark ? 'light_mode' : 'dark_mode'}
                                </span>
                            </button>
                        )}
                    </div>
                </div>

                {isMobileSearchVisible && (
                    <div className="flex items-center gap-2 animate-[slideDown_0.2s_ease-out]">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[18px]">search</span>
                            <input
                                autoFocus
                                type="text"
                                placeholder={t('common.search')}
                                className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl py-2 pl-9 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/20 focus:border-accent-green text-text-main"
                                value={searchQuery}
                                onChange={(e) => onSearchQueryChange(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={onClearSearch}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                setIsMobileSearchVisible(false);
                                onClearSearch();
                            }}
                            className="text-xs font-bold text-accent-green px-2"
                        >
                            Hủy
                        </button>
                    </div>
                )}
            </div>


        </header>
    );
};

export default CalendarHeader;
