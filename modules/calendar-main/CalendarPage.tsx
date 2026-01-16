import React, { useState } from 'react';
import CalendarGrid from './components/CalendarGrid';
import CalendarDayDetail from './components/CalendarDayDetail';
import CalendarHeader from './components/CalendarHeader';
import CalendarEventList from './components/CalendarEventList';
import DatePickerModal from '../../components/calendar/DatePickerModal';
import EventDetailModal from './components/EventDetailModal'; // <--- NEW IMPORT
import { useCalendarPageLogic } from './calendarPage.logic';
import { useEvents } from '../../contexts/EventContext';
import { deleteEvent } from '../../services/googleCalendarService'; // <--- NEW IMPORT

const CalendarPage: React.FC = () => {
    const { state, actions } = useCalendarPageLogic();
    const { events: googleEvents, loading, openModal, refreshEvents } = useEvents(); // <--- Get refreshEvents

    // State for Event Detail Modal
    const [selectedEventDetails, setSelectedEventDetails] = useState<any | null>(null);

    // Handler: Click on Event -> Open Detail Modal
    const handleEventClick = (event: any) => {
        setSelectedEventDetails(event);
    };

    // Handler: Close Detail Modal
    const handleCloseEventDetail = () => {
        setSelectedEventDetails(null);
    };

    // Handler: Edit Event
    const handleEditEvent = (event: any) => {
        setSelectedEventDetails(null);
        // Open Modal in EDIT mode by passing the event object
        openModal(undefined, event);
    };

    // Handler: Delete Event
    const handleDeleteEvent = async (event: any) => {
        if (confirm(`Bạn có chắc muốn xóa sự kiện "${event.summary}"?`)) {
            try {
                // Assuming 'primary' calendar for now
                await deleteEvent('primary', event.id);
                // Refresh list
                await refreshEvents();
                setSelectedEventDetails(null);
            } catch (error) {
                alert('Không thể xóa sự kiện');
            }
        }
    };

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

            <div className="flex-1 px-2 md:px-0 mt-1 md:mt-4 w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto xl:px-6">
                <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 h-full items-start">

                    {/* CENTER: MONTH GRID */}
                    <section className="flex-1 w-full min-w-0 bg-white dark:bg-zinc-900 rounded-2xl md:rounded-[32px] shadow-sm border border-gray-100 dark:border-zinc-800 p-2 md:p-6 xl:p-8 animate-[fadeIn_0.3s_ease-out] flex flex-col h-fit">
                        <CalendarGrid
                            date={state.currentDate}
                            onDateChange={actions.setCurrentDate}
                            onTogglePicker={() => actions.setIsPickerOpen(true)}
                            events={googleEvents}
                            onDateDoubleClick={(date) => openModal(date)}
                            onAddEventClick={(date) => openModal(date)} // <--- SINGLE CLICK ADD EVENT
                            onEventClick={handleEventClick} // <--- CLICK EVENT DETAIL
                        />
                    </section>

                    {/* RIGHT: DETAILS & EVENTS */}
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
                                events={googleEvents}
                                currentDate={state.currentDate}
                                isSearching={!!state.searchQuery}
                                onEventClick={handleEventClick} // <--- Wire this up too
                            />
                            {loading && <p className="text-xs text-center text-gray-400 mt-2">Đang tải lịch...</p>}
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

            {/* Event Detail Modal */}
            {selectedEventDetails && (
                <EventDetailModal
                    event={selectedEventDetails}
                    onClose={handleCloseEventDetail}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                />
            )}
        </div>
    );
};

export default CalendarPage;