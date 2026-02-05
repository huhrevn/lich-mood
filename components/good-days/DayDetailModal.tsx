import React from 'react';
import { DayAnalysis } from '../../types/goodDaysTypes';
import { ACTIVITIES } from '../../constants/goodDaysConstants';

interface DayDetailModalProps {
    isOpen: boolean;
    analysis: DayAnalysis | null;
    onClose: () => void;
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({ isOpen, analysis, onClose }) => {
    if (!isOpen || !analysis) return null;

    const { rating, recommendations, detailedAnalysis } = analysis;

    // Format date
    const dateStr = rating.date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const lunarDateStr = `${rating.lunarDate.day}/${rating.lunarDate.month}${rating.lunarDate.isLeap ? ' (Nhuận)' : ''}/${rating.lunarDate.year}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-text-main dark:text-zinc-50 mb-1">
                                Chi tiết ngày
                            </h2>
                            <div className="text-sm text-text-secondary">
                                {dateStr}
                            </div>
                            <div className="text-xs text-text-secondary mt-1">
                                Âm lịch: {lunarDateStr}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <span className="material-symbols-outlined text-text-secondary">close</span>
                        </button>
                    </div>

                    {/* Score badge */}
                    <div className="mt-4 flex items-center gap-3">
                        <div className={`px-4 py-2 rounded-xl font-bold text-lg ${rating.score >= 70 ? 'bg-green-500' : rating.score >= 50 ? 'bg-yellow-500' : 'bg-orange-500'
                            } text-white`}>
                            {rating.score} điểm
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-lg bg-[#2563eb]/10 text-[#2563eb] text-sm font-medium">
                                {rating.canChi.day}
                            </span>
                            <span className="text-sm text-text-secondary">
                                {rating.zodiacOfficer}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${rating.isZodiacDay
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                }`}>
                                {rating.isZodiacDay ? 'Hoàng đạo' : 'Hắc đạo'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
                    {/* Can Chi Analysis */}
                    <section>
                        <h3 className="text-sm font-semibold text-text-main dark:text-zinc-50 mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#2563eb] text-[20px]">calendar_today</span>
                            Can Chi
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            {detailedAnalysis.canChiAnalysis}
                        </p>
                    </section>

                    {/* Stars */}
                    {(rating.luckyStars.length > 0 || rating.unluckyStars.length > 0) && (
                        <section>
                            <h3 className="text-sm font-semibold text-text-main dark:text-zinc-50 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#2563eb] text-[20px]">star</span>
                                Sao chiếu mệnh
                            </h3>

                            {rating.luckyStars.length > 0 && (
                                <div className="mb-3">
                                    <div className="text-xs font-medium text-green-600 dark:text-green-400 mb-2">
                                        Sao tốt:
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {rating.luckyStars.map((star, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm"
                                            >
                                                {star}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {rating.unluckyStars.length > 0 && (
                                <div>
                                    <div className="text-xs font-medium text-red-600 dark:text-red-400 mb-2">
                                        Sao xấu:
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {rating.unluckyStars.map((star, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm"
                                            >
                                                {star}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <p className="text-sm text-text-secondary leading-relaxed mt-3">
                                {detailedAnalysis.starAnalysis}
                            </p>
                        </section>
                    )}

                    {/* Zodiac Analysis */}
                    <section>
                        <h3 className="text-sm font-semibold text-text-main dark:text-zinc-50 mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#2563eb] text-[20px]">wb_sunny</span>
                            Hoàng đạo / Hắc đạo
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            {detailedAnalysis.zodiacAnalysis}
                        </p>
                    </section>

                    {/* Recommendations */}
                    <section>
                        <h3 className="text-sm font-semibold text-text-main dark:text-zinc-50 mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#2563eb] text-[20px]">lightbulb</span>
                            Khuyến nghị
                        </h3>

                        <div className="space-y-3">
                            {/* To Do */}
                            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[18px]">
                                        check_circle
                                    </span>
                                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                        Nên làm:
                                    </span>
                                </div>
                                <ul className="space-y-1.5 ml-6">
                                    {recommendations.toDo.map((item, index) => (
                                        <li key={index} className="text-sm text-green-700 dark:text-green-300 list-disc">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* To Avoid */}
                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[18px]">
                                        cancel
                                    </span>
                                    <span className="text-sm font-medium text-red-700 dark:text-red-400">
                                        Nên tránh:
                                    </span>
                                </div>
                                <ul className="space-y-1.5 ml-6">
                                    {recommendations.toAvoid.map((item, index) => (
                                        <li key={index} className="text-sm text-red-700 dark:text-red-300 list-disc">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* General Advice */}
                    <section className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
                        <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">info</span>
                            Lời khuyên chung
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                            {detailedAnalysis.generalAdvice}
                        </p>
                    </section>

                    {/* Activity scores */}
                    {rating.activities.length > 0 && (
                        <section>
                            <h3 className="text-sm font-semibold text-text-main dark:text-zinc-50 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#2563eb] text-[20px]">assignment</span>
                                Điểm số các hoạt động
                            </h3>
                            <div className="space-y-2">
                                {rating.activities
                                    .sort((a, b) => b.score - a.score)
                                    .map((activity) => {
                                        const activityInfo = ACTIVITIES.find(a => a.id === activity.activityId);
                                        if (!activityInfo) return null;

                                        return (
                                            <div
                                                key={activity.activityId}
                                                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-zinc-800"
                                            >
                                                <span className="material-symbols-outlined text-text-secondary text-[20px]">
                                                    {activityInfo.icon}
                                                </span>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-text-main dark:text-zinc-50">
                                                        {activityInfo.name}
                                                    </div>
                                                    {activity.reasons.length > 0 && (
                                                        <div className="text-xs text-text-secondary mt-0.5">
                                                            {activity.reasons[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={`px-3 py-1 rounded-lg font-semibold text-sm ${activity.score >= 70
                                                    ? 'bg-green-500 text-white'
                                                    : activity.score >= 50
                                                        ? 'bg-yellow-500 text-white'
                                                        : 'bg-orange-500 text-white'
                                                    }`}>
                                                    {activity.score}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DayDetailModal;
