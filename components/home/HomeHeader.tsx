
import React, { useState, useEffect } from 'react';
import { UserProfile, SearchResult } from '../../types/homeTypes';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

interface HomeHeaderProps {
    user: UserProfile;
    greeting: string;
    currentTime: Date;
    // Search Props
    isSearchOpen?: boolean;
    searchQuery?: string;
    searchResults?: SearchResult[];
    isSearching?: boolean;
    onSearchOpen?: (open: boolean) => void;
    onSearchQueryChange?: (query: string) => void;
    onSelectLocation?: (loc: SearchResult) => void;
    onClearSearch?: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
    user, greeting, currentTime,
    searchQuery = '', searchResults = [], isSearching = false,
    onSearchQueryChange, onSelectLocation, onClearSearch
}) => {
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const { t } = useLanguage();

    // START: Using ThemeContext instead of local logic
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const toggleDarkMode = toggleTheme;
    // END: Using ThemeContext instead of local logic

    const displayGreeting = greeting === 'Xin chào' ? t('home.greeting') : greeting;

    return (
        <header className="sticky top-0 z-50 bg-bg-base/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-transparent dark:border-zinc-800 transition-all px-4 md:px-6 py-3">

            {/* MOBILE LAYOUT */}
            <div className="flex md:hidden items-center justify-between gap-4">
                {/* User Profile */}
                <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full overflow-hidden border border-gray-200 dark:border-zinc-700 shadow-sm">
                        <img src={user.avatar} className="w-full h-full object-cover" alt="User" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <span className="text-[10px] uppercase tracking-widest text-accent-green font-bold leading-none mb-0.5">{displayGreeting}</span>
                        <span className="text-sm font-bold text-text-main leading-none">{user.name}</span>
                    </div>
                </div>

                {/* Clock & Theme Toggle (Mobile) */}
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

                {/* Center: Search Bar */}
                <div className="col-span-8 relative z-50">
                    <div className="relative group w-full max-w-2xl">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-accent-green transition-colors text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder={t('common.search')}
                            className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/20 focus:border-accent-green shadow-sm text-text-main placeholder-gray-400 transition-all h-10"
                            value={searchQuery}
                            onChange={(e) => onSearchQueryChange && onSearchQueryChange(e.target.value)}
                        />
                        {isSearching ? (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 size-4 border-2 border-accent-green border-t-transparent rounded-full animate-spin"></div>
                        ) : searchQuery && (
                            <button
                                onClick={onClearSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                            >
                                <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                        )}
                    </div>

                    {/* Search Results Dropdown */}
                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 w-full max-w-2xl mt-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-700 overflow-hidden z-50 max-h-[300px] overflow-y-auto animate-[fadeIn_0.2s_ease-out]">
                            {searchResults.map((result) => (
                                <button
                                    key={result.id}
                                    onClick={() => onSelectLocation && onSelectLocation(result)}
                                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-800 text-sm border-b border-gray-50 dark:border-zinc-800 last:border-0 flex items-center gap-3 transition-colors group"
                                >
                                    <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${result.type === 'LOCATION'
                                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                            : result.type === 'HOLIDAY'
                                                ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                                : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                        }`}>
                                        <span className="material-symbols-outlined text-[16px]">
                                            {result.type === 'LOCATION' ? 'location_on' : result.type === 'HOLIDAY' ? 'celebration' : 'event'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-text-main group-hover:text-accent-green transition-colors text-sm truncate pr-2">
                                                {result.name}
                                            </span>
                                            {result.feature_code === 'ADM1' && (
                                                <span className="text-[9px] bg-green-50 dark:bg-green-900/30 text-accent-green px-1.5 py-0.5 rounded border border-green-100 dark:border-green-800 font-bold uppercase shrink-0">{t('weather.province')}</span>
                                            )}
                                        </div>
                                        <span className="text-[11px] text-gray-500 dark:text-zinc-400 truncate">
                                            {result.type === 'LOCATION'
                                                ? [result.admin1, result.country].filter(Boolean).join(', ')
                                                : result.description
                                            }
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Clock & Theme */}
                <div className="col-span-4 flex justify-end items-center gap-4">
                    <span className="text-2xl font-bold text-accent-green tracking-tight tabular-nums font-display">
                        {hours}:{minutes}
                    </span>

                    <button
                        onClick={toggleDarkMode}
                        className="size-10 flex items-center justify-center bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-full transition-all shadow-sm border border-gray-200 dark:border-zinc-800 group"
                        title={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
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

export default React.memo(HomeHeader);
