
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
    onSearchQueryChange, onSelectLocation, onClearSearch,
    isSearchOpen = false, onSearchOpen
}) => {
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const { t } = useLanguage();

    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const toggleDarkMode = toggleTheme;
    // Note: Search functionality removed from Header as it exists in WeatherCard

    // END: Using ThemeContext instead of local logic

    const displayGreeting = greeting === 'Xin chào' ? t('home.greeting') : greeting;

    return (
        <header className="sticky top-0 z-50 bg-bg-base/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-transparent dark:border-zinc-800 transition-all px-4 py-3 md:hidden">

            {/* MOBILE LAYOUT */}
            <div className={`flex md:hidden flex-col gap-3`}>
                <div className="flex items-center justify-between gap-4">
                    {/* User Profile */}
                    <div className="flex items-center gap-3 animate-[fadeIn_0.2s_ease-out]">
                        <div className="size-9 rounded-full overflow-hidden border border-gray-200 dark:border-zinc-700 shadow-sm">
                            <img src={user.avatar} className="w-full h-full object-cover" alt="User" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-[10px] uppercase tracking-widest text-accent-green font-bold leading-none mb-0.5">{displayGreeting}</span>
                            <span className="text-sm font-bold text-text-main leading-none">{user.name}</span>
                        </div>
                    </div>

                    {/* Clock & Actions (Mobile) */}
                    <div className="flex items-center gap-2 ml-auto">


                        <span className="text-lg font-bold text-accent-green tracking-tight tabular-nums px-1">
                            {hours}:{minutes}
                        </span>

                        <button
                            onClick={toggleDarkMode}
                            className="size-8 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-full shadow-sm border border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 animate-[fadeIn_0.2s_ease-out]"
                        >
                            <span className={`material-symbols-outlined text-[18px] ${isDark ? 'rotate-[360deg]' : ''} transition-transform duration-500`}>
                                {isDark ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>
                    </div>
                </div>


            </div>


        </header>
    );
};

export default React.memo(HomeHeader);
