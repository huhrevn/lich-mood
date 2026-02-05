import React from 'react';
import { ACTIVITIES, ACTIVITY_CATEGORIES } from '../../constants/goodDaysConstants';
import { Activity, ActivityCategory } from '../../types/goodDaysTypes';

interface ActivitySelectorProps {
    selectedActivities: string[];
    onToggleActivity: (activityId: string) => void;
    onSelectAll: () => void;
    onClearAll: () => void;
}

const ActivitySelector: React.FC<ActivitySelectorProps> = ({
    selectedActivities,
    onToggleActivity,
    onSelectAll,
    onClearAll
}) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState<ActivityCategory | 'all'>('all');

    // Filter activities
    const filteredActivities = ACTIVITIES.filter(activity => {
        const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activity.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Group by category
    const groupedActivities = React.useMemo(() => {
        const groups: Record<ActivityCategory, Activity[]> = {
            marriage: [],
            business: [],
            home: [],
            travel: [],
            spiritual: [],
            other: []
        };

        filteredActivities.forEach(activity => {
            groups[activity.category].push(activity);
        });

        return groups;
    }, [filteredActivities]);

    return (
        <div className="space-y-4">
            {/* Header with actions */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Chọn hoạt động</h3>
                <div className="flex gap-2">
                    <button
                        onClick={onSelectAll}
                        className="text-xs font-medium text-[#2563eb] hover:underline"
                    >
                        Chọn tất cả
                    </button>
                    <span className="text-slate-200 dark:text-slate-800">|</span>
                    <button
                        onClick={onClearAll}
                        className="text-xs font-medium text-slate-400 hover:underline"
                    >
                        Bỏ chọn
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm tên hoạt động..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#2563eb]/20 transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
                />
            </div>

            {/* Category filter - Horizontal Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6 no-scrollbar">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${selectedCategory === 'all'
                        ? 'bg-[#2563eb] text-white shadow-md shadow-[#2563eb]/20'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                >
                    Tất cả
                </button>
                {(Object.entries(ACTIVITY_CATEGORIES) as [ActivityCategory, any][]).map(([key, category]) => (
                    <button
                        key={key}
                        onClick={() => setSelectedCategory(key)}
                        className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${selectedCategory === key
                            ? 'bg-[#2563eb] text-white shadow-md shadow-[#2563eb]/20'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Activities grid */}
            <div className="max-h-[380px] overflow-y-auto pr-2 space-y-6 no-scrollbar">
                {selectedCategory === 'all' ? (
                    (Object.entries(groupedActivities) as [ActivityCategory, Activity[]][]).map(([category, activities]) => {
                        if (activities.length === 0) return null;
                        const categoryInfo = ACTIVITY_CATEGORIES[category];

                        return (
                            <div key={category}>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">{categoryInfo.name}</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {activities.map(activity => (
                                        <ActivityCard
                                            key={activity.id}
                                            activity={activity}
                                            isSelected={selectedActivities.includes(activity.id)}
                                            onToggle={() => onToggleActivity(activity.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {filteredActivities.map(activity => (
                            <ActivityCard
                                key={activity.id}
                                activity={activity}
                                isSelected={selectedActivities.includes(activity.id)}
                                onToggle={() => onToggleActivity(activity.id)}
                            />
                        ))}
                    </div>
                )}

                {filteredActivities.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        <span className="material-symbols-outlined text-4xl opacity-20">search_off</span>
                        <p className="mt-2 text-sm">Không tìm thấy hoạt động</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// V2 Activity Card Component
const ActivityCard: React.FC<{
    activity: Activity;
    isSelected: boolean;
    onToggle: () => void;
}> = ({ activity, isSelected, onToggle }) => {
    // Determine category color
    const getCatStyles = (cat: ActivityCategory) => {
        switch (cat) {
            case 'marriage': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-600';
            case 'business': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600';
            case 'home': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600';
            case 'travel': return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600';
            case 'spiritual': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600';
            default: return 'bg-slate-100 dark:bg-slate-800 text-slate-600';
        }
    };

    return (
        <button
            onClick={onToggle}
            className={`p-4 border rounded-2xl transition-all flex flex-col items-center gap-2 group ${isSelected
                ? 'bg-[#2563eb]/5 border-[#2563eb] ring-1 ring-[#2563eb]'
                : 'border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/30 hover:border-[#2563eb]/40'
                }`}
        >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCatStyles(activity.category)}`}>
                <span className="material-symbols-outlined text-xl">{activity.icon}</span>
            </div>
            <span className={`text-sm font-bold ${isSelected ? 'text-[#2563eb]' : 'text-slate-900 dark:text-white'}`}>
                {activity.name}
            </span>
            {isSelected && (
                <div className="absolute top-2 right-2">
                    <span className="material-symbols-outlined text-xs text-[#2563eb] filled-icon">check_circle</span>
                </div>
            )}
        </button>
    );
};

export default ActivitySelector;
