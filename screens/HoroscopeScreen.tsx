import React, { useState } from 'react';
import BirthInfoForm from '../components/horoscope/BirthInfoForm';
import PalaceChart from '../components/horoscope/PalaceChart';
import PalaceDetailModal from '../components/horoscope/PalaceDetailModal';
import { BirthInfo, BirthChart, Palace, PalaceAnalysis, YearlyFortune } from '../types/horoscopeTypes';
import { calculateBirthChart, analyzePalace, predictYearlyFortune } from '../services/horoscopeService';
import { FIVE_ELEMENTS_INFO } from '../constants/horoscopeConstants';

const HoroscopeScreen: React.FC = () => {
    const [birthChart, setBirthChart] = useState<BirthChart | null>(null);
    const [selectedPalace, setSelectedPalace] = useState<PalaceAnalysis | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'life-palace' | 'fortune'>('overview');
    const [yearlyFortune, setYearlyFortune] = useState<YearlyFortune | null>(null);

    const handleBirthInfoSubmit = (birthInfo: BirthInfo) => {
        const chart = calculateBirthChart(birthInfo);
        setBirthChart(chart);

        // Calculate yearly fortune for current year
        const currentYear = new Date().getFullYear();
        const fortune = predictYearlyFortune(chart, currentYear);
        setYearlyFortune(fortune);
    };

    const handlePalaceClick = (palace: Palace) => {
        const analysis = analyzePalace(palace);
        setSelectedPalace(analysis);
        setIsModalOpen(true);
    };

    const handleReset = () => {
        setBirthChart(null);
        setYearlyFortune(null);
        setActiveTab('overview');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 pb-24 md:pb-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 md:px-6 py-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                            <span className="material-symbols-outlined text-white text-[32px] filled-icon">
                                auto_awesome
                            </span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Tử Vi Đẩu Số
                            </h1>
                            <p className="text-purple-100 text-sm">
                                Khám phá vận mệnh qua lá số Tử Vi
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
                {!birthChart ? (
                    /* Birth Info Form */
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 p-6 md:p-8 shadow-xl">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-text-main dark:text-zinc-50 mb-2">
                                    Nhập thông tin sinh
                                </h2>
                                <p className="text-sm text-text-secondary">
                                    Vui lòng cung cấp thông tin chính xác để có kết quả tốt nhất
                                </p>
                            </div>
                            <BirthInfoForm onSubmit={handleBirthInfoSubmit} />
                        </div>
                    </div>
                ) : (
                    /* Birth Chart Display */
                    <div className="space-y-6">
                        {/* Birth info summary + Reset button */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                                        <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">
                                            person
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-text-main dark:text-zinc-50">
                                            {birthChart.birthInfo.date.toLocaleDateString('vi-VN')} •
                                            Giờ {birthChart.birthInfo.hour} •
                                            {birthChart.birthInfo.gender === 'male' ? ' Nam' : ' Nữ'}
                                        </div>
                                        <div className="text-xs text-text-secondary mt-1">
                                            Cục {FIVE_ELEMENTS_INFO[birthChart.destiny].name} •
                                            Âm lịch: {birthChart.birthInfo.lunarDate?.day}/{birthChart.birthInfo.lunarDate?.month}/{birthChart.birthInfo.lunarDate?.year}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-text-secondary hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors text-sm font-medium"
                                >
                                    Nhập lại
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-2">
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`py-3 px-4 rounded-xl font-medium transition-all ${activeTab === 'overview'
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                                            : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-zinc-800'
                                        }`}
                                >
                                    Tổng quan
                                </button>
                                <button
                                    onClick={() => setActiveTab('life-palace')}
                                    className={`py-3 px-4 rounded-xl font-medium transition-all ${activeTab === 'life-palace'
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                                            : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-zinc-800'
                                        }`}
                                >
                                    Cung Mệnh
                                </button>
                                <button
                                    onClick={() => setActiveTab('fortune')}
                                    className={`py-3 px-4 rounded-xl font-medium transition-all ${activeTab === 'fortune'
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                                            : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-zinc-800'
                                        }`}
                                >
                                    Vận Hạn
                                </button>
                            </div>
                        </div>

                        {/* Tab content */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Palace Chart */}
                                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
                                    <h3 className="text-lg font-bold text-text-main dark:text-zinc-50 mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">
                                            grid_view
                                        </span>
                                        Lá Số Tử Vi
                                    </h3>
                                    <PalaceChart palaces={birthChart.palaces} onPalaceClick={handlePalaceClick} />
                                </div>

                                {/* Basic Analysis */}
                                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
                                    <h3 className="text-lg font-bold text-text-main dark:text-zinc-50 mb-4">
                                        Phân tích cơ bản
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-sm font-semibold text-text-main dark:text-zinc-50 mb-2">
                                                Tính cách
                                            </div>
                                            <p className="text-sm text-text-secondary leading-relaxed">
                                                {birthChart.analysis.personality}
                                            </p>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
                                                <div className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                                                    Điểm mạnh
                                                </div>
                                                <ul className="space-y-1">
                                                    {birthChart.analysis.strengths.map((strength, index) => (
                                                        <li key={index} className="text-sm text-green-700 dark:text-green-300 list-disc ml-4">
                                                            {strength}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800">
                                                <div className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-2">
                                                    Cần cải thiện
                                                </div>
                                                <ul className="space-y-1">
                                                    {birthChart.analysis.weaknesses.map((weakness, index) => (
                                                        <li key={index} className="text-sm text-orange-700 dark:text-orange-300 list-disc ml-4">
                                                            {weakness}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
                                            <div className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
                                                Hướng phát triển
                                            </div>
                                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                                {birthChart.analysis.lifeDirection}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'life-palace' && (
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
                                <h3 className="text-lg font-bold text-text-main dark:text-zinc-50 mb-4">
                                    Phân tích Cung Mệnh
                                </h3>
                                {(() => {
                                    const lifePalace = birthChart.palaces[birthChart.lifePalacePosition];
                                    const analysis = analyzePalace(lifePalace);
                                    return (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`px-4 py-2 rounded-xl font-bold text-lg ${analysis.quality === 'excellent' || analysis.quality === 'good'
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-yellow-500 text-white'
                                                    }`}>
                                                    {analysis.rating} điểm
                                                </div>
                                                <span className="text-text-secondary">
                                                    {lifePalace.meaning}
                                                </span>
                                            </div>
                                            <p className="text-sm text-text-secondary leading-relaxed">
                                                {analysis.interpretation}
                                            </p>
                                            {lifePalace.stars.length > 0 && (
                                                <div>
                                                    <div className="text-sm font-semibold text-text-main dark:text-zinc-50 mb-2">
                                                        Các sao trong cung
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {lifePalace.stars.map((star, index) => (
                                                            <span
                                                                key={index}
                                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${star.isBenefic
                                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                                                    }`}
                                                            >
                                                                {star.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
                                                <div className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
                                                    Lời khuyên
                                                </div>
                                                <ul className="space-y-1">
                                                    {analysis.advice.map((item, index) => (
                                                        <li key={index} className="text-sm text-blue-700 dark:text-blue-300 list-disc ml-4">
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {activeTab === 'fortune' && yearlyFortune && (
                            <div className="space-y-6">
                                {/* Overall rating */}
                                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
                                    <h3 className="text-lg font-bold text-text-main dark:text-zinc-50 mb-4">
                                        Vận hạn năm {yearlyFortune.year}
                                    </h3>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`px-6 py-3 rounded-xl font-bold text-2xl ${yearlyFortune.overallRating >= 60
                                                ? 'bg-green-500 text-white'
                                                : 'bg-yellow-500 text-white'
                                            }`}>
                                            {yearlyFortune.overallRating}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold text-text-main dark:text-zinc-50">
                                                Điểm tổng quan
                                            </div>
                                            <div className="text-xs text-text-secondary mt-1">
                                                {yearlyFortune.overallRating >= 60 ? 'Năm thuận lợi' : 'Năm trung bình'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Predictions */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">
                                                    work
                                                </span>
                                                <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                                                    Sự nghiệp
                                                </span>
                                            </div>
                                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                                {yearlyFortune.predictions.career}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-[20px]">
                                                    payments
                                                </span>
                                                <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                                                    Tài chính
                                                </span>
                                            </div>
                                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                                {yearlyFortune.predictions.wealth}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[20px]">
                                                    favorite
                                                </span>
                                                <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                                                    Sức khỏe
                                                </span>
                                            </div>
                                            <p className="text-sm text-green-700 dark:text-green-300">
                                                {yearlyFortune.predictions.health}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-pink-50 dark:bg-pink-900/10 border border-pink-200 dark:border-pink-800">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="material-symbols-outlined text-pink-600 dark:text-pink-400 text-[20px]">
                                                    favorite_border
                                                </span>
                                                <span className="text-sm font-semibold text-pink-700 dark:text-pink-400">
                                                    Tình cảm
                                                </span>
                                            </div>
                                            <p className="text-sm text-pink-700 dark:text-pink-300">
                                                {yearlyFortune.predictions.relationship}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Lucky/Unlucky months */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
                                        <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-3">
                                            Tháng tốt
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {yearlyFortune.luckyMonths.map((month) => (
                                                <span
                                                    key={month}
                                                    className="px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium"
                                                >
                                                    Tháng {month}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
                                        <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3">
                                            Tháng cần chú ý
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {yearlyFortune.unluckyMonths.map((month) => (
                                                <span
                                                    key={month}
                                                    className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium"
                                                >
                                                    Tháng {month}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Advice */}
                                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
                                    <h4 className="text-sm font-semibold text-text-main dark:text-zinc-50 mb-3">
                                        Lời khuyên cho năm {yearlyFortune.year}
                                    </h4>
                                    <ul className="space-y-2">
                                        {yearlyFortune.advice.map((item, index) => (
                                            <li key={index} className="text-sm text-text-secondary list-disc ml-4">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Palace Detail Modal */}
            <PalaceDetailModal
                isOpen={isModalOpen}
                analysis={selectedPalace}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default HoroscopeScreen;
