
import React from 'react';
import CalendarGrid from './components/CalendarGrid';
import CalendarDayDetail from './components/CalendarDayDetail';
import CalendarHeader from './components/CalendarHeader';
import CalendarEventList from './components/CalendarEventList';
import DatePickerModal from '../../components/calendar/DatePickerModal'; // Shared
import { useCalendarPageLogic } from './calendarPage.logic';

const CalendarPage: React.FC = () => {
    const { state, actions } = useCalendarPageLogic();

    return (
        <div className="calendar-main-module pb-24 pt-0 px-0 md:pb-6 min-h-screen bg-bg-base font-display relative flex flex-col overflow-x-hidden">
            <div className="px-3 md:px-6">
                <CalendarHeader 
                    user={state.user}
                    greeting={state.greeting}
                    currentTime={state.currentTime}
                    searchQuery={state.searchQuery}
                    onSearchQueryChange={actions.setSearchQuery}
                    onClearSearch={actions.handleClearSearch}
                />
            </div>

            {/* 
                LAYOUT REFACTOR:
                - Increased max-width to 1920px for better large screen usage.
                - Switched from Grid to Flex on XL (Desktop) screens.
                - Mobile/Tablet (lg and below) remains Grid/Flex-Col behavior implicitly via fallback or specific overrides if needed, 
                  but here we use flex-col mobile -> flex-row desktop strategy.
            */}
            <div className="flex-1 px-2 md:px-0 mt-1 md:mt-4 w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto xl:px-6">
                <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 h-full items-start">
                    
                    {/* 
                        CENTER: MONTH GRID (Flexible) 
                        - flex-1: Takes all available space
                        - min-w-0: Prevents flexbox overflow issues
                    */}
                    <section className="flex-1 w-full min-w-0 bg-white dark:bg-zinc-900 rounded-2xl md:rounded-[32px] shadow-sm border border-gray-100 dark:border-zinc-800 p-2 md:p-6 xl:p-8 animate-[fadeIn_0.3s_ease-out] flex flex-col h-fit">
                        <CalendarGrid 
                            date={state.currentDate} 
                            onDateChange={actions.setCurrentDate}
                            onTogglePicker={() => actions.setIsPickerOpen(true)}
                        />
                    </section>
                    
                    {/* 
                        RIGHT: DETAILS & EVENTS (Fixed Width)
                        - Fixed width on Desktop (XL): 380px -> 420px depending on density
                        - Full width on Mobile/Tablet
                    */}
                    <div className="flex flex-col gap-4 xl:gap-6 w-full xl:w-[380px] 2xl:w-[420px] shrink-0 min-w-0">
                        
                        <section className="bg-white dark:bg-zinc-900 rounded-2xl md:rounded-[24px] shadow-sm border border-gray-100 dark:border-zinc-800 p-4 md:p-5 animate-[slideUp_0.3s_ease-out]">
                            <div className="flex items-center gap-2 mb-3 md:mb-4 text-accent-green">
                                <span className="material-symbols-outlined text-[16px] md:text-[18px]">info</span>
                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Chi tiết ngày</span>
                            </div>
                            <CalendarDayDetail 
                                date={state.currentDate} 
                                onDateChange={actions.setCurrentDate}
                            />
                        </section>

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

export default CalendarPage;
