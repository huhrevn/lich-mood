
import React, { useState } from 'react';
import { useConverterLogic } from '../hooks/useConverterLogic';
import ConverterHeader from '../components/converter/ConverterHeader';
import ConverterForm from '../components/converter/ConverterForm';
import ConverterResult from '../components/converter/ConverterResult';
import FateOverviewCard from '../components/FateOverviewCard';
import CalendarDayDetail from '../components/CalendarDayDetail';
import CalendarEventList from '../components/calendar/CalendarEventList';
import { useCalendarLogic } from '../hooks/useCalendarLogic'; // Logic reuse for sidebar events

const ConverterScreen: React.FC = () => {
    const { state, actions } = useConverterLogic();
    // Using Calendar Logic to populate the Sidebar Events (UI Only)
    const { state: calendarState, actions: calendarActions } = useCalendarLogic();

    return (
        <div className="min-h-screen bg-bg-base flex flex-col font-display text-text-main pb-24 xl:pb-6 transition-colors">
            {/* Header (Shared) */}
            <ConverterHeader onReset={actions.resetToToday} />

            <main className="flex-1 w-full max-w-[1920px] mx-auto p-4 lg:p-6 transition-all duration-300">

                {/* --- DESKTOP LAYOUT (FLEX ROW with Fixed Sidebar) --- */}
                <div className="flex flex-col xl:flex-row gap-6 items-start h-full">

                    {/* LEFT COLUMN (MAIN CONVERTER - Expands to fill space) */}
                    <div className="flex-1 w-full min-w-0 flex flex-col gap-6">

                        {/* MAIN CARD */}
                        <div className="bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-gray-100 dark:border-zinc-800 overflow-visible relative flex flex-col xl:p-8">

                            {/* Desktop Custom Tabs (Pill Shape) */}
                            <div className="hidden xl:flex justify-center mb-8">
                                <div className="bg-gray-100 dark:bg-zinc-800 p-1.5 rounded-full flex w-[400px] shadow-inner relative">
                                    {/* Active Indicator Background */}
                                    <div
                                        className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-accent-green shadow-lg shadow-accent-green/30 rounded-full transition-all duration-300 ease-in-out z-0 ${state.mode === 'SOLAR_TO_LUNAR' ? 'left-1.5' : 'left-[calc(50%+3px)]'
                                            }`}
                                    ></div>

                                    <button
                                        onClick={() => actions.setMode('SOLAR_TO_LUNAR')}
                                        className={`relative z-10 flex-1 py-2 text-xs font-bold rounded-full transition-all duration-200 flex items-center justify-center gap-2 ${state.mode === 'SOLAR_TO_LUNAR'
                                            ? 'text-white'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400'
                                            }`}
                                    >
                                        <span className={`material-symbols-outlined text-[18px] ${state.mode === 'SOLAR_TO_LUNAR' ? 'text-white' : ''}`}>wb_sunny</span>
                                        Dương → Âm
                                    </button>
                                    <button
                                        onClick={() => actions.setMode('LUNAR_TO_SOLAR')}
                                        className={`relative z-10 flex-1 py-2 text-xs font-bold rounded-full transition-all duration-200 flex items-center justify-center gap-2 ${state.mode === 'LUNAR_TO_SOLAR'
                                            ? 'text-white'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400'
                                            }`}
                                    >
                                        <span className={`material-symbols-outlined text-[18px] ${state.mode === 'LUNAR_TO_SOLAR' ? 'text-white' : ''}`}>dark_mode</span>
                                        Âm → Dương
                                    </button>
                                </div>
                            </div>

                            {/* Split Content: Input | Swap | Result */}
                            <div className="flex flex-col xl:flex-row gap-6 xl:items-stretch">
                                {/* INPUT SECTION (LEFT) - 45% on large screens */}
                                <div className="p-4 pb-0 xl:p-0 xl:w-[45%] flex flex-col">
                                    <ConverterForm
                                        mode={state.mode}
                                        setMode={actions.setMode}
                                        // Solar Props
                                        solarDay={state.solarDay} setSolarDay={actions.setSolarDay}
                                        solarMonth={state.solarMonth} setSolarMonth={actions.setSolarMonth}
                                        solarYear={state.solarYear} setSolarYear={actions.setSolarYear}
                                        // Lunar Props
                                        lunarYearStr={state.lunarYearStr}
                                        setLunarYearStr={actions.setLunarYearStr}
                                        selectedLunarMonthKey={state.selectedLunarMonthKey}
                                        setSelectedLunarMonthKey={actions.setSelectedLunarMonthKey}
                                        selectedLunarDay={state.selectedLunarDay}
                                        setSelectedLunarDay={actions.setSelectedLunarDay}
                                        lunarMonthOptions={state.lunarMonthOptions}
                                        maxLunarDays={state.maxLunarDays}
                                        error={state.error}
                                        onReset={actions.resetToToday}
                                    />
                                </div>

                                {/* DESKTOP SWAP BUTTON (CENTER) - 10% */}
                                <div className="hidden xl:flex flex-col justify-center items-center w-[10%]">
                                    <button
                                        onClick={() => actions.setMode(state.mode === 'SOLAR_TO_LUNAR' ? 'LUNAR_TO_SOLAR' : 'SOLAR_TO_LUNAR')}
                                        className="size-12 rounded-full border border-gray-100 shadow-sm bg-gray-50 hover:bg-white hover:border-accent-green hover:text-accent-green text-gray-400 flex items-center justify-center transition-all group"
                                    >
                                        <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-300">swap_horiz</span>
                                    </button>
                                </div>

                                {/* RESULT SECTION (RIGHT) - 45% */}
                                {state.result && !state.error && (
                                    <div className="px-4 pb-6 xl:p-0 xl:w-[45%] animate-[fadeIn_0.3s_ease-out] flex flex-col items-center justify-center border-t xl:border-t-0 xl:border-l border-gray-100 dark:border-zinc-800 xl:pl-6 border-dashed mt-2 pt-6 xl:mt-0 xl:pt-0">
                                        <div className="w-full h-full flex flex-col">
                                            {/* Result Header */}
                                            <div className="hidden xl:flex items-center gap-2 mb-6 text-xs font-bold text-accent-green uppercase tracking-wide">
                                                <span className="material-symbols-outlined text-[20px] filled-icon">event_available</span>
                                                {state.mode === 'SOLAR_TO_LUNAR' ? 'KẾT QUẢ ÂM LỊCH' : 'KẾT QUẢ DƯƠNG LỊCH'}
                                            </div>

                                            {/* Result Content (Vertically Centered) */}
                                            <div className="flex-1 flex flex-col items-center justify-center">
                                                <ConverterResult
                                                    result={state.result}
                                                    mode={state.mode}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* FATE OVERVIEW (Main Col Bottom) */}
                        {state.result && !state.error && (
                            <div className="animate-[slideUp_0.4s_ease-out] mt-0">
                                <FateOverviewCard
                                    date={state.result.date}
                                    result={state.result}
                                />
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDEBAR (Desktop Only Info - Fixed Width) */}
                    {/* Fixed width 380px - 420px prevents it from getting too wide on large screens */}
                    <div className="hidden xl:flex w-[380px] 2xl:w-[420px] flex-col gap-6 shrink-0">
                        {state.result && (
                            <>
                                {/* Day Detail Mini Card */}
                                <div className="bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-gray-100 dark:border-zinc-800 p-6 animate-[fadeIn_0.4s_ease-out]">
                                    <div className="flex items-center gap-2 mb-4 text-accent-green">
                                        <span className="material-symbols-outlined text-[20px]">info</span>
                                        <span className="text-xs font-bold uppercase tracking-widest">Chi tiết ngày</span>
                                    </div>
                                    <CalendarDayDetail
                                        date={state.result.date}
                                        onDateChange={() => { }} // Read-only view in sidebar
                                    />
                                </div>

                                {/* Events Mini Card */}
                                <div className="bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-gray-100 dark:border-zinc-800 p-6 animate-[fadeIn_0.5s_ease-out] flex-1 min-h-[300px] flex flex-col">
                                    <CalendarEventList
                                        events={calendarState.events}
                                        currentDate={state.result.date}
                                        isSearching={false}
                                        onEventClick={calendarActions.handleEventClick}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

export default ConverterScreen;
