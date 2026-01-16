
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

    // START: Using ThemeContext instead of local logic
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark'; // Map context theme to isDark boolean for existing UI logic
    const toggleDarkMode = toggleTheme; // Alias for compatibility
    // END: Using ThemeContext instead of local logic

    const displayGreeting = greeting === 'Xin chào' ? t('home.greeting') : greeting;

    return (
        <header className="sticky top-0 z-50 bg-bg-base/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-transparent dark:border-zinc-800 transition-all px-4 md:px-0 py-3">
            {/* MOBILE LAYOUT */}
            <div className="flex md:hidden items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full overflow-hidden border border-gray-200 dark:border-zinc-700 shadow-sm">
                        <img src={user.avatar} className="w-full h-full object-cover" alt="User" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <span className="text-[10px] uppercase tracking-widest text-accent-green font-bold leading-none mb-0.5">{displayGreeting}</span>
                        <span className="text-sm font-bold text-text-main leading-none">{user.name}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-accent-green tracking-tight tabular-nums">
                        {hours}:{minutes}
                    </span>
                    <button
                        onClick={toggleDarkMode}
                        className="size-8 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-full shadow-sm border border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400"
                    >
                        <span className={`material-symbols-outlined text-[18px] ${isDark ? 'rotate-[360deg]' : ''} transition-transform duration-500`}>
                            {isDark ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>
                </div>
            </div>

            {/* DESKTOP LAYOUT */}
            <div className="hidden md:grid grid-cols-12 gap-6 items-center h-10">
                <div className="col-span-8 relative z-50">
                    <div className="relative group w-full md:max-w-2xl">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-accent-green transition-colors text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder={t('common.search')}
                            className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/20 focus:border-accent-green shadow-sm text-text-main placeholder-gray-400 transition-all h-10"
                            value={searchQuery}
                            onChange={(e) => onSearchQueryChange(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={onClearSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                            >
                                <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="col-span-4 flex justify-end items-center gap-4">
                    <span className="text-2xl font-bold text-accent-green tracking-tight tabular-nums font-display">
                        {hours}:{minutes}
                    </span>
                    <button
                        onClick={toggleDarkMode}
                        className="size-10 flex items-center justify-center bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-full transition-all shadow-sm border border-gray-200 dark:border-zinc-800 group"
                    >
                        <span className={`material-symbols-outlined text-gray-500 dark:text-zinc-400 text-[20px] transition-transform duration-500 ${isDark ? 'rotate-[360deg]' : ''}`}>
                            {isDark ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default CalendarHeader;
