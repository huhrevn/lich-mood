import React from 'react';
import { useAddEventForm } from '../../hooks/useAddEventForm';
import { GOOGLE_EVENT_COLORS } from '../../services/googleCalendarService';

interface AddEventMobileProps {
    form: ReturnType<typeof useAddEventForm>;
}

const AddEventMobile: React.FC<AddEventMobileProps> = ({ form }) => {
    const {
        title, setTitle,
        description, setDescription,
        startDate, handleStartDateChange,
        startTime, handleStartTimeChange,
        endDate, handleEndDateChange,
        endTime, handleEndTimeChange,
        isAllDay, setIsAllDay,
        calendars, selectedCalendarId, setSelectedCalendarId,
        selectedColorId, setSelectedColorId,
        formatDisplayDate,
        handleSubmit,
        closeModal,
        editingEvent,
        activeTab, setActiveTab
    } = form;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-[24px] overflow-hidden">
            {/* Mobile Header Actions */}
            <div className="flex justify-between items-center px-6 py-3 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-20">
                <button type="button" onClick={closeModal} className="text-[16px] text-gray-500 dark:text-gray-400 font-medium">Hủy</button>
                <div className="absolute left-1/2 -translate-x-1/2 text-[17px] font-bold text-gray-900 dark:text-white">
                    {editingEvent ? 'Sửa sự kiện' : 'Sự kiện mới'}
                </div>
                <button type="button" onClick={handleSubmit} className="text-[16px] text-blue-600 font-bold">
                    {editingEvent ? 'Cập nhật' : 'Lưu'}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                {/* Title Input */}
                <div className="px-6 pt-5 pb-2">
                    <div className="flex items-center gap-4">
                        <div className="size-6 shrink-0"></div> {/* Spacer to match icons */}
                        <input
                            type="text"
                            placeholder="Thêm tiêu đề"
                            className="flex-1 text-[22px] text-text-main bg-transparent border-none outline-none placeholder-gray-400 font-semibold py-1 pl-[40px]"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                </div>

                {/* Mobile Type Selection Pills */}
                <div className="flex flex-wrap gap-2 pl-[64px] pr-6 mb-5">
                    <button
                        type="button"
                        onClick={() => setActiveTab('event')}
                        className={`px-5 py-1.5 rounded-full text-[14px] font-semibold whitespace-nowrap transition-all border ${activeTab === 'event' ? 'bg-blue-600/10 text-blue-600 border-blue-600/20 shadow-sm' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 border-transparent'}`}
                    >
                        Sự kiện
                    </button>
                    <button
                        type="button"
                        className="px-5 py-1.5 rounded-full text-[14px] font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-500 border border-transparent whitespace-nowrap"
                    >
                        Việc cần làm
                    </button>
                    <button
                        type="button"
                        className="px-5 py-1.5 rounded-full text-[14px] font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-500 border border-transparent whitespace-nowrap"
                    >
                        Sinh nhật
                    </button>
                </div>

                <div className="px-6">
                    {/* Time Section */}
                    <div className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-gray-400 mt-2 text-2xl">schedule</span>
                        <div className="flex-1 space-y-5">
                            {/* All Day Toggle */}
                            <div className="flex items-center justify-between">
                                <span className="text-[17px] font-medium text-gray-700 dark:text-gray-200">Cả ngày</span>
                                <div
                                    onClick={() => setIsAllDay(!isAllDay)}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer relative ${isAllDay ? 'bg-blue-600' : 'bg-gray-300 dark:bg-zinc-700'}`}
                                >
                                    <div className={`size-4 bg-white rounded-full transition-transform shadow-sm ${isAllDay ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            {/* Start Date/Time */}
                            <div className="flex items-center justify-between">
                                <div className="relative flex-1 flex items-center justify-between pl-[40px]">
                                    <div className="text-[17px] font-medium text-gray-700 dark:text-gray-200">
                                        {formatDisplayDate(startDate, false)}
                                    </div>
                                    <input type="date" className="absolute inset-0 opacity-0 w-full" value={startDate} onChange={(e) => handleStartDateChange(e.target.value)} />

                                    {!isAllDay && (
                                        <div className="relative">
                                            <div className="text-[17px] font-medium text-gray-700 dark:text-gray-200">
                                                {startTime}
                                            </div>
                                            <input type="time" className="absolute inset-0 opacity-0 w-full" value={startTime} onChange={(e) => handleStartTimeChange(e.target.value)} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* End Date/Time */}
                            <div className="flex items-center justify-between">
                                <div className="relative flex-1 flex items-center justify-between pl-[40px]">
                                    <div className="text-[17px] font-medium text-gray-700 dark:text-gray-200">
                                        {formatDisplayDate(endDate, false)}
                                    </div>
                                    <input type="date" className="absolute inset-0 opacity-0 w-full" value={endDate} onChange={(e) => handleEndDateChange(e.target.value)} />

                                    {!isAllDay && (
                                        <div className="relative">
                                            <div className="text-[17px] font-medium text-gray-700 dark:text-gray-200">
                                                {endTime}
                                            </div>
                                            <input type="time" className="absolute inset-0 opacity-0 w-full" value={endTime} onChange={(e) => handleEndTimeChange(e.target.value)} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Calendar Selector */}
                <div className="flex flex-wrap gap-2 px-6 py-6 border-t border-b border-gray-100 dark:border-zinc-800 mt-5">
                    {calendars.map(c => (
                        <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedCalendarId(c.id)}
                            className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${selectedCalendarId === c.id ? 'bg-blue-100 text-blue-600 border border-blue-200' : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 border border-transparent'}`}
                        >
                            <div className="size-2.5 rounded-full" style={{ backgroundColor: c.backgroundColor }}></div>
                            {c.summary}
                        </button>
                    ))}
                </div>

                {/* Location */}
                <div className="flex items-center gap-4 group px-6 py-4">
                    <span className="material-symbols-outlined text-gray-400 text-2xl">location_on</span>
                    <div className="flex-1 border-b border-gray-100 dark:border-zinc-800 group-focus-within:border-blue-500 transition-all bg-transparent">
                        <input type="text" placeholder="Thêm vị trí" className="w-full bg-transparent border-none outline-none text-[17px] font-medium text-text-main placeholder-gray-400 py-2" />
                    </div>
                </div>

                {/* Color Selection */}
                <div className="flex items-center gap-4 px-6 pt-2">
                    <span className="material-symbols-outlined text-gray-400 text-2xl">palette</span>
                    <div className="flex-1 py-2 border-b border-gray-100 dark:border-zinc-800 overflow-x-auto no-scrollbar flex gap-3">
                        {Object.entries(GOOGLE_EVENT_COLORS).map(([id, hex]) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setSelectedColorId(id)}
                                className={`size-8 rounded-full shrink-0 flex items-center justify-center transition-transform ${selectedColorId === id ? 'scale-110 shadow-sm ring-2 ring-offset-2 ring-gray-200 dark:ring-zinc-700' : ''}`}

                                style={{ backgroundColor: hex }}
                            >
                                {selectedColorId === id && <span className="material-symbols-outlined text-white text-[18px] font-bold">check</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="flex items-start gap-4 px-6 pt-6 pb-10">
                    <span className="material-symbols-outlined text-gray-400 text-2xl pt-1">notes</span>
                    <div className="flex-1 border-b border-gray-100 dark:border-zinc-800 focus-within:border-blue-500 transition-all">
                        <textarea
                            placeholder="Thêm nội dung mô tả"
                            rows={3}
                            className="w-full bg-transparent text-[17px] text-text-main placeholder-gray-400 outline-none resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEventMobile;
