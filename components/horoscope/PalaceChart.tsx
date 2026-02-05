import React from 'react';
import { Palace } from '../../types/horoscopeTypes';
import { EARTHLY_BRANCHES } from '../../constants/horoscopeConstants';

interface PalaceChartProps {
    palaces: Palace[];
    onPalaceClick: (palace: Palace) => void;
}

const PalaceChart: React.FC<PalaceChartProps> = ({ palaces, onPalaceClick }) => {
    // Arrange palaces in traditional 4x4 grid
    // Layout: Tỵ-Ngọ-Mùi-Thân (top row)
    //         Thìn-CENTER-CENTER-Dậu (middle rows)
    //         Mão-CENTER-CENTER-Tuất
    //         Dần-Sửu-Tý-Hợi (bottom row)

    const getPalaceByBranch = (branchId: string): Palace | undefined => {
        return palaces.find(p => p.branch === branchId);
    };

    const renderPalaceCell = (palace: Palace | undefined, isCenter: boolean = false) => {
        if (isCenter) {
            return (
                <div className="col-span-2 row-span-2 flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl border-2 border-purple-300 dark:border-purple-700">
                    <div className="text-center">
                        <span className="material-symbols-outlined text-[48px] text-purple-600 dark:text-purple-400 filled-icon">
                            auto_awesome
                        </span>
                        <div className="text-sm font-semibold text-purple-700 dark:text-purple-300 mt-2">
                            Tử Vi
                        </div>
                        <div className="text-xs text-purple-600 dark:text-purple-400">
                            Đẩu Số
                        </div>
                    </div>
                </div>
            );
        }

        if (!palace) return null;

        const beneficStars = palace.stars.filter(s => s.isBenefic);
        const maleficStars = palace.stars.filter(s => !s.isBenefic);
        const isGood = beneficStars.length > maleficStars.length;

        return (
            <button
                onClick={() => onPalaceClick(palace)}
                className={`p-3 rounded-xl border-2 transition-all hover:shadow-lg ${palace.isLifePalace
                        ? 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border-yellow-500 dark:border-yellow-600'
                        : isGood
                            ? 'bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-800 hover:border-green-500'
                            : 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-800 hover:border-red-500'
                    }`}
            >
                {/* Branch name */}
                <div className="flex items-center justify-between mb-2">
                    <div className={`text-lg font-bold ${palace.isLifePalace ? 'text-yellow-700 dark:text-yellow-400' : 'text-text-main dark:text-zinc-50'
                        }`}>
                        {EARTHLY_BRANCHES.find(b => b.id === palace.branch)?.name}
                    </div>
                    {palace.isLifePalace && (
                        <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-[20px] filled-icon">
                            star
                        </span>
                    )}
                </div>

                {/* Palace name */}
                <div className="text-xs font-medium text-text-secondary mb-2">
                    {palace.meaning}
                </div>

                {/* Stars */}
                <div className="space-y-1">
                    {palace.stars.slice(0, 3).map((star, index) => (
                        <div
                            key={index}
                            className={`text-xs px-2 py-0.5 rounded ${star.isBenefic
                                    ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                                    : 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
                                }`}
                        >
                            {star.name}
                        </div>
                    ))}
                    {palace.stars.length > 3 && (
                        <div className="text-xs text-text-secondary">
                            +{palace.stars.length - 3} sao
                        </div>
                    )}
                </div>
            </button>
        );
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-4 gap-3 aspect-square">
                {/* Top row: Tỵ-Ngọ-Mùi-Thân */}
                {renderPalaceCell(getPalaceByBranch('ti'))}
                {renderPalaceCell(getPalaceByBranch('ngo'))}
                {renderPalaceCell(getPalaceByBranch('mui'))}
                {renderPalaceCell(getPalaceByBranch('than'))}

                {/* Second row: Thìn-CENTER-CENTER-Dậu */}
                {renderPalaceCell(getPalaceByBranch('thin'))}
                {renderPalaceCell(undefined, true)}
                {renderPalaceCell(getPalaceByBranch('dau'))}

                {/* Third row: Mão-CENTER-CENTER-Tuất */}
                {renderPalaceCell(getPalaceByBranch('mao'))}
                {/* Center continues from above */}
                {renderPalaceCell(getPalaceByBranch('tuat'))}

                {/* Bottom row: Dần-Sửu-Tý-Hợi */}
                {renderPalaceCell(getPalaceByBranch('dan'))}
                {renderPalaceCell(getPalaceByBranch('suu'))}
                {renderPalaceCell(getPalaceByBranch('ty'))}
                {renderPalaceCell(getPalaceByBranch('hoi'))}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-500"></div>
                    <span className="text-text-secondary">Cung Mệnh</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-50 border-2 border-green-300"></div>
                    <span className="text-text-secondary">Cát cung</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-50 border-2 border-red-300"></div>
                    <span className="text-text-secondary">Hung cung</span>
                </div>
            </div>
        </div>
    );
};

export default PalaceChart;
