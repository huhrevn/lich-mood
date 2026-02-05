import React from 'react';
import { PalaceAnalysis } from '../../types/horoscopeTypes';

interface PalaceDetailModalProps {
    isOpen: boolean;
    analysis: PalaceAnalysis | null;
    onClose: () => void;
}

const PalaceDetailModal: React.FC<PalaceDetailModalProps> = ({ isOpen, analysis, onClose }) => {
    if (!isOpen || !analysis) return null;

    const { palace, rating, quality, interpretation, advice, influences } = analysis;

    const getQualityColor = () => {
        switch (quality) {
            case 'excellent':
                return 'bg-green-500';
            case 'good':
                return 'bg-green-400';
            case 'neutral':
                return 'bg-yellow-500';
            case 'bad':
                return 'bg-red-500';
        }
    };

    const getQualityLabel = () => {
        switch (quality) {
            case 'excellent':
                return 'Rất tốt';
            case 'good':
                return 'Tốt';
            case 'neutral':
                return 'Trung bình';
            case 'bad':
                return 'Cần chú ý';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white mb-1">
                                {palace.meaning}
                            </h2>
                            <div className="text-purple-100 text-sm">
                                Chi: {palace.branch.toUpperCase()}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <span className="material-symbols-outlined text-white">close</span>
                        </button>
                    </div>

                    {/* Rating badge */}
                    <div className="mt-4 flex items-center gap-3">
                        <div className={`px-4 py-2 rounded-xl ${getQualityColor()} text-white font-bold text-lg`}>
                            {rating} điểm
                        </div>
                        <span className="text-white text-sm">
                            {getQualityLabel()}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
                    {/* Interpretation */}
                    <section>
                        <h3 className="text-sm font-semibold text-text-main dark:text-zinc-50 mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[20px]">
                                description
                            </span>
                            Giải nghĩa
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            {interpretation}
                        </p>
                    </section>

                    {/* Stars in palace */}
                    {palace.stars.length > 0 && (
                        <section>
                            <h3 className="text-sm font-semibold text-text-main dark:text-zinc-50 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[20px]">
                                    star
                                </span>
                                Các sao trong cung
                            </h3>
                            <div className="space-y-2">
                                {palace.stars.map((star, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-lg ${star.isBenefic
                                                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <div className={`font-semibold text-sm ${star.isBenefic
                                                        ? 'text-green-700 dark:text-green-400'
                                                        : 'text-red-700 dark:text-red-400'
                                                    }`}>
                                                    {star.name}
                                                </div>
                                                <div className="text-xs text-text-secondary mt-1">
                                                    {star.description}
                                                </div>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${star.isBenefic
                                                    ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                                                    : 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
                                                }`}>
                                                {star.type === 'major' ? 'Chính' : star.type === 'minor' ? 'Phụ' : 'Sát'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Influences */}
                    {Object.keys(influences).length > 0 && (
                        <section>
                            <h3 className="text-sm font-semibold text-text-main dark:text-zinc-50 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[20px]">
                                    trending_up
                                </span>
                                Ảnh hưởng
                            </h3>
                            <div className="space-y-2">
                                {influences.career && (
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[18px]">
                                            work
                                        </span>
                                        <div className="flex-1">
                                            <div className="text-xs font-medium text-text-main dark:text-zinc-50">Sự nghiệp</div>
                                            <div className="text-xs text-text-secondary">{influences.career}</div>
                                        </div>
                                    </div>
                                )}
                                {influences.wealth && (
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-[18px]">
                                            payments
                                        </span>
                                        <div className="flex-1">
                                            <div className="text-xs font-medium text-text-main dark:text-zinc-50">Tài chính</div>
                                            <div className="text-xs text-text-secondary">{influences.wealth}</div>
                                        </div>
                                    </div>
                                )}
                                {influences.health && (
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[18px]">
                                            favorite
                                        </span>
                                        <div className="flex-1">
                                            <div className="text-xs font-medium text-text-main dark:text-zinc-50">Sức khỏe</div>
                                            <div className="text-xs text-text-secondary">{influences.health}</div>
                                        </div>
                                    </div>
                                )}
                                {influences.relationship && (
                                    <div className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-pink-600 dark:text-pink-400 text-[18px]">
                                            favorite_border
                                        </span>
                                        <div className="flex-1">
                                            <div className="text-xs font-medium text-text-main dark:text-zinc-50">Tình cảm</div>
                                            <div className="text-xs text-text-secondary">{influences.relationship}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Advice */}
                    <section className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
                        <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">lightbulb</span>
                            Lời khuyên
                        </h3>
                        <ul className="space-y-1.5">
                            {advice.map((item, index) => (
                                <li key={index} className="text-sm text-blue-700 dark:text-blue-300 list-disc ml-5">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PalaceDetailModal;
