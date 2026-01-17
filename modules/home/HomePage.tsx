
import React from 'react';
import LunarDetailCard from '../../components/LunarDetailCard'; // Kept in Shared/root components as it's simple
import HomeUpcomingEvents from './components/HomeUpcomingEvents';
import { useHomePageLogic } from './home.logic';
import HomeHeader from '../../components/home/HomeHeader'; // Used by Home, so kept
import WeatherCard from '../../components/home/WeatherCard';
import ScheduleSheet from '../../components/home/ScheduleSheet';

const HomePage: React.FC = () => {
    const { state, actions } = useHomePageLogic();

    return (
        <div className="home-module bg-bg-base min-h-screen relative pb-28 md:pb-0 overflow-x-hidden font-display text-text-main selection:bg-accent-green selection:text-white antialiased">
            <HomeHeader
                user={state.user}
                greeting={state.greeting}
                currentTime={state.currentTime}
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

            <main className="px-4 pt-2 md:px-0 md:pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">

                    <div className="flex flex-col gap-4 lg:gap-6 lg:col-span-7 xl:col-span-8">
                        <section className="animate-[fadeIn_0.3s_ease-out]">
                            <LunarDetailCard
                                date={state.selectedDate}
                                onDateChange={actions.setSelectedDate}
                            />
                        </section>

                        <section className="hidden md:block h-full animate-[fadeIn_0.35s_ease-out]">
                            <HomeUpcomingEvents />
                        </section>
                    </div>

                    <div className="flex flex-col gap-4 lg:gap-6 lg:col-span-5 xl:col-span-4 h-full">
                        <section>
                            <WeatherCard
                                weather={state.weather}
                                currentLocation={state.currentLocation}
                                loadingWeather={state.loadingWeather}
                                isSearchOpen={state.isSearchOpen}
                                searchQuery={state.searchQuery}
                                isSearching={state.isSearching}
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

                        <ScheduleSheet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
