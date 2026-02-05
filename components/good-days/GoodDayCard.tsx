import React from 'react';
import { DayQuality, GoodDayResult } from '../../types/goodDaysTypes';
import { ACTIVITIES } from '../../constants/goodDaysConstants';
import lunisolar from 'lunisolar';

interface GoodDayCardProps {
    result: GoodDayResult;
    onViewDetails: () => void;
}

const GoodDayCard: React.FC<GoodDayCardProps> = ({ result, onViewDetails }) => {
    const { date, rating, matchedActivities, averageScore, highlights } = result;

    // Format dates
    const solarDateStr = date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const lunarDateStr = `${rating.lunarDate.day}/${rating.lunarDate.month}${rating.lunarDate.isLeap ? ' (Nhuận)' : ''}/${rating.lunarDate.year}`;

    // Get quality color
    const getQualityColor = (quality: DayQuality) => {
        switch (quality) {
            case 'excellent':
                return 'bg-green-500 text-white';
            case 'good':
                return 'bg-green-400 text-white';
            case 'neutral':
                return 'bg-yellow-400 text-white';
            case 'bad':
                return 'bg-orange-500 text-white';
            case 'terrible':
                return 'bg-red-500 text-white';
        }
    };

    const getQualityLabel = (quality: DayQuality) => {
        switch (quality) {
            case 'excellent':
                return 'Rất tốt';
            case 'good':
                return 'Tốt';
            case 'neutral':
                return 'Bình thường';
            case 'bad':
                return 'Không tốt';
            case 'terrible':
                return 'Rất xấu';
        }
    };

    // Get matched activity names
    const activityNames = matchedActivities
        .map(id => ACTIVITIES.find(a => a.id === id)?.name)
        .filter(Boolean)
        .slice(0, 3);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onClick={onViewDetails}>
            {/* Header with score */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-[#2563eb] text-lg">calendar_today</span>
                        <div className="text-base font-bold text-slate-900 dark:text-white capitalize">
                            {solarDateStr}
                        </div>
                    </div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-7">
                        Âm lịch: {lunarDateStr}
                    </div>
                </div>
                <div className={`px-4 py-2 rounded-2xl ${averageScore >= 80 ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'} font-black text-lg shadow-sm border border-white dark:border-slate-800`}>
                    {averageScore}
                </div>
            </div>

            {/* Can Chi Info Pillar */}
            <div className="flex items-center gap-2 mb-4 pl-7">
                <div className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    {rating.canChi.day}
                </div>
                <div className="h-1 w-1 rounded-full bg-slate-200"></div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${rating.isZodiacDay ? 'text-amber-500' : 'text-slate-400'}`}>
                    {rating.isZodiacDay ? 'Hoàng đạo' : 'Hắc đạo'} • {rating.zodiacOfficer}
                </div>
            </div>

            {/* highlights / Matched activities */}
            <div className="space-y-3 mb-6 pl-7">
                <div className="flex flex-wrap gap-1.5">
                    {matchedActivities.map((id, index) => {
                        const activity = ACTIVITIES.find(a => a.id === id);
                        if (!activity) return null;
                        return (
                            <span
                                key={index}
                                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center gap-1.5 border border-slate-100 dark:border-slate-800"
                            >
                                <span className="material-symbols-outlined text-sm">{activity.icon}</span>
                                {activity.name}
                            </span>
                        );
                    })}
                </div>

                {highlights.length > 0 && (
                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-amber-400 text-lg filled-icon">verified</span>
                        <div className="text-xs text-slate-500 italic line-clamp-1">
                            {highlights[0]} {highlights.length > 1 && `& ${highlights.length - 1} lý do khác`}
                        </div>
                    </div>
                )}
            </div>

            {/* View details button highlight */}
            <div className="pt-4 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between text-xs font-bold text-[#2563eb] group-hover:px-2 transition-all">
                <span>Xem giải mã chi tiết</span>
                <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
            </div>
        </div>
    );
};

export default GoodDayCard;
