
import React from 'react';
import LunarDetailCard from '../components/LunarDetailCard';
import HomeMonthCalendar from '../components/home/HomeMonthCalendar'; // Use new Home optimized component
import { useHomeLogic } from '../hooks/useHomeLogic';
import HomeHeader from '../components/home/HomeHeader';
import WeatherCard from '../components/home/WeatherCard';
import ScheduleSheet from '../components/home/ScheduleSheet';

const HomeScreen: React.FC = () => {
    const { state, actions } = useHomeLogic();

    return (
        <div className="bg-bg-base min-h-screen relative pb-28 md:pb-0 overflow-x-hidden font-display text-text-main selection:bg-accent-green selection:text-white antialiased">
            {/* --- HEADER --- */}
            <HomeHeader 
                user={state.user} 
                greeting={state.greeting} 
                currentTime={state.currentTime}
                // Search State
                isSearchOpen={state.isSearchOpen}
                searchQuery={state.searchQuery}
                searchResults={state.searchResults}
                isSearching={state.isSearching}
                onSearchOpen={actions.setIsSearchOpen}
                onSearchQueryChange={actions.setSearchQuery}
                onSelectLocation={actions.handleSelectLocation}
                onClearSearch={() => {
                    actions.setSearchQuery('');
                    actions.setSearchResults([]);
                }}
            />

            {/* --- MAIN CONTENT --- */}
            <main className="px-4 pt-2 md:px-0 md:pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
                    
                    {/* LEFT COLUMN (Lunar Calendar + Month Calendar) */}
                    <div className="flex flex-col gap-4 lg:gap-6 lg:col-span-7 xl:col-span-8">
                        <section className="animate-[fadeIn_0.3s_ease-out]">
                            <LunarDetailCard 
                                date={state.selectedDate} 
                                onDateChange={actions.setSelectedDate} 
                            />
                        </section>

                        {/* Month Grid Card - Optimized for Home (Reduced padding on Desktop) */}
                        <section className="hidden md:block bg-white dark:bg-zinc-900 rounded-[24px] shadow-card dark:shadow-none border border-gray-100 dark:border-zinc-800 p-5 md:p-6 lg:p-4 animate-[fadeIn_0.35s_ease-out]">
                            <HomeMonthCalendar 
                                date={state.selectedDate} 
                                onDateChange={actions.setSelectedDate} 
                            />
                        </section>
                    </div>

                    {/* RIGHT COLUMN (Weather + Schedule) */}
                    <div className="flex flex-col gap-4 lg:gap-6 lg:col-span-5 xl:col-span-4 h-full">
                        {/* 2. WEATHER CARD */}
                        <section>
                            <WeatherCard 
                                weather={state.weather}
                                currentLocation={state.currentLocation}
                                loadingWeather={state.loadingWeather}
                                isSearchOpen={state.isSearchOpen}
                                searchQuery={state.searchQuery}
                                isSearching={state.isSearching}
                                // Filter results for WeatherCard to only show LOCATIONS
                                searchResults={state.searchResults.filter(r => r.type === 'LOCATION')}
                                currentTime={state.currentTime}
                                onSearchOpen={actions.setIsSearchOpen}
                                onSearchQueryChange={actions.setSearchQuery}
                                onSelectLocation={actions.handleSelectLocation}
                                onClearSearch={() => {
                                    actions.setSearchQuery('');
                                    actions.setSearchResults([]);
                                }}
                            />
                        </section>

                        {/* 3. SCHEDULE SHEET */}
                        <ScheduleSheet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomeScreen;
