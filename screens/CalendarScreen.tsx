
import React from 'react';
import PageMonthCalendar from '../components/calendar/PageMonthCalendar';
import CalendarDayDetail from '../components/CalendarDayDetail';
import { useCalendarLogic } from '../hooks/useCalendarLogic';
import HomeHeader from '../components/home/HomeHeader';
import CalendarEventList from '../components/calendar/CalendarEventList';
import DatePickerModal from '../components/calendar/DatePickerModal';
import { useHomeLogic } from '../hooks/useHomeLogic';

const CalendarScreen: React.FC = () => {
    const { state, actions } = useCalendarLogic();
    const { state: homeState } = useHomeLogic(); 

    return (
        <div className="pb-24 pt-0 px-0 md:pb-6 min-h-screen bg-bg-base font-display relative flex flex-col overflow-x-hidden">
            {/* Top Global Header */}
            <div className="px-3 md:px-6">
                <HomeHeader 
                    user={homeState.user}
                    greeting={homeState.greeting}
                    currentTime={homeState.currentTime}
                    searchQuery={state.searchQuery}
                    isSearching={false}
                    onSearchQueryChange={actions.setSearchQuery}
                    onClearSearch={actions.handleClearSearch}
                />
            </div>

            {/* 
                UPDATED LAYOUT CONTAINER
                - Mobile: Default block/flex-col
                - Desktop (lg+): Flex row with Fixed Sidebar
            */}
            <div className="flex-1 px-3 md:px-6 mt-2 md:mt-4 w-full max-w-[1800px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-full items-start">
                    
                    {/* LEFT: MONTH GRID (Flexible - Takes remaining space) */}
                    <section className="flex-1 w-full min-w-0 bg-white dark:bg-zinc-900 rounded-2xl md:rounded-[32px] shadow-sm border border-gray-100 dark:border-zinc-800 p-2 md:p-6 animate-[fadeIn_0.3s_ease-out] flex flex-col h-fit">
                        <PageMonthCalendar 
                            date={state.currentDate} 
                            onDateChange={actions.setCurrentDate}
                            onTogglePicker={() => actions.setIsPickerOpen(true)}
                        />
                    </section>
                    
                    {/* RIGHT: DETAILS & EVENTS (Fixed Width on Desktop) */}
                    <div className="w-full lg:w-[380px] xl:w-[420px] 2xl:w-[460px] shrink-0 flex flex-col gap-4 lg:gap-6">
                        
                        {/* 1. Day Detail Card */}
                        <section className="bg-white dark:bg-zinc-900 rounded-2xl md:rounded-[24px] shadow-sm border border-gray-100 dark:border-zinc-800 p-4 md:p-5 animate-[slideUp_0.3s_ease-out]">
                            <div className="flex items-center gap-2 mb-3 md:mb-4 text-accent-green">
                                <span className="material-symbols-outlined text-[18px]">info</span>
                                <span className="text-xs font-bold uppercase tracking-widest">Chi tiết ngày</span>
                            </div>
                            <CalendarDayDetail 
                                date={state.currentDate} 
                                onDateChange={actions.setCurrentDate}
                            />
                        </section>

                        {/* 2. Events List */}
                        <section className="flex flex-col flex-1 min-h-0 bg-white dark:bg-zinc-900 rounded-2xl md:rounded-[24px] shadow-sm border border-gray-100 dark:border-zinc-800 p-4 md:p-5">
                            <CalendarEventList 
                                events={state.events}
                                currentDate={state.currentDate}
                                isSearching={!!state.searchQuery}
                                onEventClick={actions.handleEventClick}
                            />
                        </section>
                    </div>
                </div>
            </div>

            <DatePickerModal 
                isOpen={state.isPickerOpen}
                currentYear={state.currentDate.getFullYear()}
                currentMonth={state.currentDate.getMonth()}
                onClose={() => actions.setIsPickerOpen(false)}
                onSelect={actions.handleMonthSelect}
            />
        </div>
    );
};

export default CalendarScreen;
