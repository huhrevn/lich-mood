import React from 'react';
import { useAddEventForm } from '../../hooks/useAddEventForm';
import { GOOGLE_EVENT_COLORS } from '../../services/googleCalendarService';

interface AddEventDesktopProps {
    form: ReturnType<typeof useAddEventForm>;
}

const AddEventDesktop: React.FC<AddEventDesktopProps> = ({ form }) => {
    const {
        title, setTitle,
        description, setDescription,
        startDate, handleStartDateChange,
        startTime, handleStartTimeChange,
        endDate, handleEndDateChange,
        endTime, handleEndTimeChange,
        isAllDay, setIsAllDay,
        recurrence, setRecurrence,
        activeTab, setActiveTab,
        calendars, selectedCalendarId, setSelectedCalendarId,
        selectedColorId, setSelectedColorId,
        transparency, setTransparency,
        visibility, setVisibility,
        showColorPicker, setShowColorPicker,
        isLoading,
        colorPickerRef, recurrenceOptions,
        editingEvent,
        formatDisplayDate,
        handleSubmit,
        closeModal,
        currentCalendar,
        getEventColor
    } = form;

    return (
        <div className="flex flex-col max-h-[90vh] bg-white dark:bg-zinc-900 rounded-lg shadow-2xl overflow-hidden w-[540px] animate-[scaleIn_0.15s_ease-out]">
            {/* Header Actions */}
            <div className="flex justify-between items-center px-4 py-2 bg-gray-100/50 dark:bg-zinc-800/30 handle-drag cursor-move">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gray-500 text-[20px]">drag_indicator</span>
                </div>
                <button onClick={closeModal} className="size-8 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 flex items-center justify-center text-gray-500 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-1 pb-4">
                {/* Title Input */}
                <div className="px-12 pt-4 pb-2">
                    <input
                        type="text"
                        placeholder="Thêm tiêu đề và thời gian"
                        className="w-full text-[24px] text-text-main bg-transparent border-b border-gray-200 dark:border-zinc-700 focus:border-blue-500 outline-none placeholder-gray-400 transition-colors py-1 font-display"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />
                </div>

                {/* Tabs */}
                <div className="flex px-12 gap-2 mb-4">
                    <button
                        type="button"
                        onClick={() => setActiveTab('event')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'event' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800'}`}
                    >
                        Sự kiện
                    </button>
                    <button
                        type="button"
                        className="px-4 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800"
                    >
                        Việc cần làm
                    </button>
                    <button
                        type="button"
                        className="px-4 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800"
                    >
                        Lịch hẹn
                    </button>
                </div>

                {/* Main Form Content */}
                <div className="px-4 space-y-4">

                    {/* Time Section */}
                    <div className="flex items-start gap-4 group">
                        <div className="w-8 flex justify-center pt-2">
                            <span className="material-symbols-outlined text-gray-500 text-[20px]">schedule</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                {/* Date/Time Inputs */}
                                {isAllDay ? (
                                    <div className="flex items-center gap-2">
                                        <div className="relative hover:bg-gray-100 dark:hover:bg-zinc-800 rounded px-2 py-1 transition-colors">
                                            <span className="text-sm text-gray-700 dark:text-gray-200 cursor-pointer">
                                                {formatDisplayDate(startDate, false)}
                                            </span>
                                            <input type="date" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" value={startDate} onChange={(e) => handleStartDateChange(e.target.value)} onClick={(e) => (e.target as any).showPicker()} />
                                        </div>
                                        <span className="text-sm text-gray-400">-</span>
                                        <div className="relative hover:bg-gray-100 dark:hover:bg-zinc-800 rounded px-2 py-1 transition-colors">
                                            <span className="text-sm text-gray-700 dark:text-gray-200 cursor-pointer">
                                                {formatDisplayDate(endDate, false)}
                                            </span>
                                            <input type="date" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" value={endDate} onChange={(e) => handleEndDateChange(e.target.value)} onClick={(e) => (e.target as any).showPicker()} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <div className="relative hover:bg-gray-100 dark:hover:bg-zinc-800 rounded px-2 py-1 transition-colors">
                                            <span className="text-sm text-gray-700 dark:text-gray-200 cursor-pointer whitespace-nowrap">
                                                {formatDisplayDate(startDate, true)}
                                            </span>
                                            <input type="date" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" value={startDate} onChange={(e) => handleStartDateChange(e.target.value)} onClick={(e) => (e.target as any).showPicker()} />
                                        </div>
                                        <div className="relative hover:bg-gray-100 dark:hover:bg-zinc-800 rounded px-2 py-1 transition-colors w-[60px]">
                                            <span className="text-sm text-gray-700 dark:text-gray-200 cursor-pointer">
                                                {startTime}
                                            </span>
                                            <input type="time" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" value={startTime} onChange={(e) => handleStartTimeChange(e.target.value)} onClick={(e) => (e.target as any).showPicker()} />
                                        </div>
                                        <span className="text-sm text-gray-400">-</span>
                                        <div className="relative hover:bg-gray-100 dark:hover:bg-zinc-800 rounded px-2 py-1 transition-colors w-[60px]">
                                            <span className="text-sm text-gray-700 dark:text-gray-200 cursor-pointer">
                                                {endTime}
                                            </span>
                                            <input type="time" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" value={endTime} onChange={(e) => handleEndTimeChange(e.target.value)} onClick={(e) => (e.target as any).showPicker()} />
                                        </div>
                                        <div className="relative hover:bg-gray-100 dark:hover:bg-zinc-800 rounded px-2 py-1 transition-colors">
                                            <span className="text-sm text-gray-700 dark:text-gray-200 cursor-pointer whitespace-nowrap">
                                                {formatDisplayDate(endDate, true)}
                                            </span>
                                            <input type="date" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" value={endDate} onChange={(e) => handleEndDateChange(e.target.value)} onClick={(e) => (e.target as any).showPicker()} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <div className={`size-4 rounded border flex items-center justify-center transition-all ${isAllDay ? 'bg-blue-600 border-blue-600' : 'border-gray-400 dark:border-zinc-600'}`}>
                                        {isAllDay && <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={isAllDay} onChange={(e) => setIsAllDay(e.target.checked)} />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Cả ngày</span>
                                </label>

                                <div className="relative text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded px-2 py-1 cursor-pointer transition-colors">
                                    <span>{recurrenceOptions.find(o => o.value === recurrence)?.label || 'Không lặp lại'}</span>
                                    <select
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        value={recurrence}
                                        onChange={(e) => setRecurrence(e.target.value)}
                                    >
                                        {recurrenceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Guests (Static for now) */}
                    <div className="flex items-center gap-4 group">
                        <div className="w-8 flex justify-center">
                            <span className="material-symbols-outlined text-gray-500 text-[20px]">group_add</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Thêm khách"
                            className="flex-1 bg-transparent border-none outline-none text-sm text-text-main placeholder-gray-500 py-1.5 hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded px-2 -ml-2 transition-colors"
                        />
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-4 group">
                        <div className="w-8 flex justify-center">
                            <span className="material-symbols-outlined text-gray-500 text-[20px]">location_on</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Thêm địa điểm"
                            className="flex-1 bg-transparent border-none outline-none text-sm text-text-main placeholder-gray-500 py-1.5 hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded px-2 -ml-2 transition-colors"
                        />
                    </div>

                    {/* Description */}
                    <div className="flex items-start gap-4 group">
                        <div className="w-8 flex justify-center pt-2">
                            <span className="material-symbols-outlined text-gray-500 text-[20px]">notes</span>
                        </div>
                        <textarea
                            placeholder="Thêm mô tả"
                            rows={3}
                            className="flex-1 bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-3 text-sm text-text-main placeholder-gray-500 outline-none resize-none border border-transparent focus:border-blue-500/30 transition-all font-display"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Calendar & Color Wrapper */}
                    <div className="flex items-center gap-4 group pt-2">
                        <div className="w-8 flex justify-center">
                            <span className="material-symbols-outlined text-gray-500 text-[20px]">calendar_month</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Calendar Selector */}
                            <div className="relative hover:bg-gray-100 dark:hover:bg-zinc-800 rounded px-2 py-1.5 cursor-pointer transition-colors -ml-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {currentCalendar.summary}
                                </span>
                                <select
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    value={selectedCalendarId}
                                    onChange={(e) => setSelectedCalendarId(e.target.value)}
                                >
                                    {calendars.map(c => <option key={c.id} value={c.id}>{c.summary}</option>)}
                                </select>
                            </div>

                            {/* Color Picker */}
                            <div className="relative" ref={colorPickerRef}>
                                <button
                                    type="button"
                                    onClick={() => setShowColorPicker(!showColorPicker)}
                                    className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded-full transition-colors"
                                >
                                    <div className="size-4 rounded-full shadow-sm" style={{ backgroundColor: selectedColorId ? getEventColor(selectedColorId) : currentCalendar.backgroundColor }}></div>
                                </button>
                                {showColorPicker && (
                                    <div className="absolute bottom-full left-0 mb-2 p-3 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 z-50 grid grid-cols-6 gap-2 w-[200px]">
                                        {Object.entries(GOOGLE_EVENT_COLORS).map(([id, hex]) => (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => { setSelectedColorId(id); setShowColorPicker(false); }}
                                                className="size-6 rounded-full hover:scale-110 transition-transform shadow-sm"
                                                style={{ backgroundColor: hex }}
                                                title={id}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Visibility & Availability */}
                    <div className="flex items-center gap-4 ml-12 pb-2">
                        <div className="relative hover:bg-gray-100 dark:hover:bg-zinc-800 rounded px-2 py-1 cursor-pointer transition-colors -ml-2">
                            <div className="flex items-center gap-1">
                                <div className={`size-2.5 rounded-full ${transparency === 'opaque' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                <span className="text-xs text-gray-600 dark:text-gray-400">{transparency === 'opaque' ? 'Bận' : 'Rảnh'}</span>
                            </div>
                            <select className="absolute inset-0 opacity-0 cursor-pointer" value={transparency} onChange={(e) => setTransparency(e.target.value as any)}>
                                <option value="opaque">Bận</option>
                                <option value="transparent">Rảnh</option>
                            </select>
                        </div>

                        <div className="relative hover:bg-gray-100 dark:hover:bg-zinc-800 rounded px-2 py-1 cursor-pointer transition-colors">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px] text-gray-500">visibility</span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">Mặc định</span>
                            </div>
                            <select className="absolute inset-0 opacity-0 cursor-pointer" value={visibility} onChange={(e) => setVisibility(e.target.value as any)}>
                                <option value="default">Mặc định</option>
                                <option value="public">Công khai</option>
                                <option value="private">Riêng tư</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Footer */}
            <div className="flex justify-end items-center gap-2 px-6 py-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
                <button
                    type="button"
                    onClick={handleSubmit} // Using handleSubmit for "Tùy chọn khác" for now as placeholder
                    className="text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 px-4 py-2 rounded font-medium text-sm transition-colors"
                >
                    Tùy chọn khác
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-bold shadow-sm transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                    {isLoading && <span className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                    {editingEvent ? 'Lưu' : 'Lưu'}
                </button>
            </div>

            {/* Message Toast */}
            {form.message && (
                <div className={`absolute bottom-20 left-1/2 -translate-x-1/2 z-[110] bg-gray-900/90 dark:bg-zinc-800 text-white px-4 py-2 rounded shadow-lg text-sm flex items-center gap-2 animate-[slideUp_0.2s_ease-out]`}>
                    <span className={`material-symbols-outlined text-[18px] ${form.message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {form.message.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    {form.message.text}
                </div>
            )}
        </div>
    );
};

export default AddEventDesktop;
