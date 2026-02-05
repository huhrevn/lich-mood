import React, { useState, useEffect } from 'react';
import ActivitySelector from '../components/good-days/ActivitySelector';
import GoodDayCard from '../components/good-days/GoodDayCard';
import DayDetailModal from '../components/good-days/DayDetailModal';
import { findGoodDays, getDayAnalysis } from '../services/goodDaysService';
import { GoodDayResult, DayAnalysis } from '../types/goodDaysTypes';
import { DATE_RANGE_PRESETS, ACTIVITIES } from '../constants/goodDaysConstants';

const GoodDaysScreen: React.FC = () => {
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    const [birthYear, setBirthYear] = useState<string>('');
    const [minScore, setMinScore] = useState<number>(60);
    const [results, setResults] = useState<GoodDayResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedAnalysis, setSelectedAnalysis] = useState<DayAnalysis | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Search for good days
    const handleSearch = () => {
        if (selectedActivities.length === 0) {
            alert('Vui lòng chọn ít nhất một hoạt động');
            return;
        }

        setLoading(true);

        // Simulate async operation
        setTimeout(() => {
            const searchResults = findGoodDays({
                activities: selectedActivities,
                startDate,
                endDate,
                birthYear: birthYear ? parseInt(birthYear) : undefined,
                minScore,
                maxResults: 30
            });

            setResults(searchResults);
            setLoading(false);
        }, 500);
    };

    // View day details
    const handleViewDetails = (result: GoodDayResult) => {
        const analysis = getDayAnalysis(
            result.date,
            selectedActivities,
            birthYear ? parseInt(birthYear) : undefined
        );
        setSelectedAnalysis(analysis);
        setIsModalOpen(true);
    };

    // Toggle activity selection
    const handleToggleActivity = (activityId: string) => {
        setSelectedActivities(prev =>
            prev.includes(activityId)
                ? prev.filter(id => id !== activityId)
                : [...prev, activityId]
        );
    };

    // Select all activities
    const handleSelectAll = () => {
        setSelectedActivities(ACTIVITIES.map(a => a.id));
    };

    // Clear all activities
    const handleClearAll = () => {
        setSelectedActivities([]);
    };

    // Set date range preset
    const handleSetPreset = (preset: typeof DATE_RANGE_PRESETS[0]) => {
        setStartDate(preset.start);
        setEndDate(preset.end);
    };

    return (
        <div className="min-h-screen flex flex-col pt-0">
            {/* V2 Header */}
            <header className="h-20 bg-white/0 dark:bg-slate-900/0 backdrop-blur-none sticky top-0 z-10 px-8 flex items-center justify-between border-b border-transparent dark:border-transparent">
                <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Xem Ngày Tốt</h2>
                        <p className="text-sm text-slate-500">Tra cứu ngày tốt lành theo phong tục âm lịch truyền thống</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">AI Đề Xuất</span>
                    <button
                        onClick={handleSearch}
                        disabled={loading || selectedActivities.length === 0}
                        className="bg-[#2563eb] hover:bg-[#2563eb]/90 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-[#2563eb]/25 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                        ) : (
                            <span className="material-symbols-outlined text-lg">search</span>
                        )}
                        Tìm ngày tốt
                    </button>
                </div>
            </header>

            <div className="flex-1 p-8 grid grid-cols-12 gap-8">
                {/* Column Left (5 cols) */}
                <div className="col-span-12 lg:col-span-5 space-y-6">
                    {/* Activity Selector Area */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/50">
                        <ActivitySelector
                            selectedActivities={selectedActivities}
                            onToggleActivity={handleToggleActivity}
                            onSelectAll={handleSelectAll}
                            onClearAll={handleClearAll}
                        />
                    </div>

                    {/* Time Range Preset Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/50">
                        <h3 className="font-bold text-lg mb-6 text-slate-900 dark:text-white">Khoảng thời gian</h3>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {DATE_RANGE_PRESETS.map((preset, index) => {
                                const isActive = startDate.getTime() === preset.start.getTime() && endDate.getTime() === preset.end.getTime();
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleSetPreset(preset)}
                                        className={`py-3 rounded-2xl text-sm font-semibold transition-all border ${isActive
                                            ? 'bg-[#2563eb]/10 text-[#2563eb] border-[#2563eb]/20 font-bold'
                                            : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-transparent'
                                            }`}
                                    >
                                        {preset.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Custom Birth Year (Advanced Option moved here for cleaner UI) */}
                        <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800/50">
                            <h3 className="font-bold text-sm mb-4 text-slate-400 uppercase tracking-widest">Tùy chọn nâng cao</h3>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500">Năm sinh của bạn</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">cake</span>
                                        <input
                                            type="number"
                                            value={birthYear}
                                            onChange={(e) => setBirthYear(e.target.value)}
                                            placeholder="VD: 1990"
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#2563eb]/20 transition-all text-slate-900 dark:text-white"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400">Dùng để tính tuổi xung/hợp với từng ngày.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column Right (7 cols) - Results or Empty State */}
                <div className="col-span-12 lg:col-span-7">
                    {results.length === 0 && !loading ? (
                        /* V2 Empty State (AI Dashboard style) */
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800/50 h-full min-h-[600px] flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563eb]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2563eb]/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
                            <div className="flex-1 flex flex-col items-center justify-center p-12 relative z-[1]">
                                <div className="w-64 h-64 relative mb-8">
                                    <div className="absolute inset-0 bg-[#2563eb]/10 rounded-full"></div>
                                    <div className="absolute inset-4 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-inner">
                                        <span className="material-symbols-outlined text-7xl text-[#2563eb]/40">event_note</span>
                                    </div>
                                    <div className="absolute -top-2 -right-2 bg-white dark:bg-slate-700 p-3 rounded-2xl shadow-xl border border-slate-50 dark:border-slate-600 transform rotate-12">
                                        <span className="material-symbols-outlined text-[#2563eb]">verified</span>
                                    </div>
                                </div>
                                <div className="text-center max-w-sm">
                                    <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Sẵn sàng tìm ngày lành?</h3>
                                    <p className="text-slate-500 mb-8">Chọn các hoạt động quan trọng và khoảng thời gian bạn mong muốn để AI của chúng tôi tìm ra những ngày đại cát nhất.</p>
                                    <div className="space-y-4 text-left">
                                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-50 dark:border-slate-800/50">
                                            <div className="mt-1 w-6 h-6 rounded-full bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center text-xs font-bold">1</div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">Chọn tối đa <span className="font-bold text-slate-900 dark:text-white">5 hoạt động</span> khác nhau để so sánh.</p>
                                        </div>
                                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-50 dark:border-slate-800/50">
                                            <div className="mt-1 w-6 h-6 rounded-full bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center text-xs font-bold">2</div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">Hệ thống sẽ dựa vào <span className="font-bold text-slate-900 dark:text-white">năm sinh của bạn</span> để tối ưu kết quả.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-slate-50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-800/20 flex items-center justify-between text-[10px] text-slate-400 font-medium tracking-wide">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">info</span>
                                    DỮ LIỆU DỰA TRÊN LỊCH VẠN NIÊN & PHONG THỦY HỌC
                                </div>
                                <div className="uppercase">Phiên bản 2.4.0</div>
                            </div>
                        </div>
                    ) : (
                        /* Results Grid */
                        <div className="space-y-6">
                            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-sm">
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">
                                        Tìm thấy {results.length} ngày phù hợp
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">
                                        Kết quả AI đề xuất tốt nhất
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-xs font-bold border border-green-100 dark:border-green-800">
                                    <span className="material-symbols-outlined text-[16px] filled-icon">check_circle</span>
                                    Đã đồng bộ tuổi
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {results.map((result, index) => (
                                    <GoodDayCard
                                        key={index}
                                        result={result}
                                        onViewDetails={() => handleViewDetails(result)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail modal */}
            <DayDetailModal
                isOpen={isModalOpen}
                analysis={selectedAnalysis}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default GoodDaysScreen;
