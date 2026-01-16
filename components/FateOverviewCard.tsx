
import React from 'react';
import { ConversionResult } from '../types/converterTypes';
import { HOUR_NAMES, HOUR_RANGES } from '../constants/converterConstants';

interface FateOverviewCardProps {
    date: Date;
    result?: ConversionResult; // Make result optional but prefer it
}

const FateOverviewCard: React.FC<FateOverviewCardProps> = ({ result }) => {

    // If no result is passed (e.g. initial load or legacy usage), return null or loading
    // In this app flow, ConverterScreen always passes result if valid.
    if (!result) return null;

    const { lichAmDuong, nguHanh, luckyHours } = result;

    return (
        <div className="w-full bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden font-display animate-[slideUp_0.4s_ease-out] mt-4">
            {/* Header */}
            <div className="flex items-center justify-between p-5 pb-2">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent-green text-xl">auto_awesome</span>
                    <h3 className="text-[15px] font-extrabold text-[#111827] dark:text-gray-100 uppercase tracking-wide">Chi tiết Vận Mệnh</h3>
                </div>
            </div>

            <div className="px-4 pb-6">
                {/* 1. Hero Card: Tiết Khí & Mệnh */}
                <div className={`relative rounded-[20px] p-5 mb-5 overflow-hidden ${result.isZodiacDay ? 'bg-accent-green' : 'bg-gray-800 dark:bg-zinc-800'}`}>
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

                    <div className="relative z-10">
                        {/* Tiết Khí Badge */}
                        <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 mb-3 hover:bg-white/20 transition-colors">
                            <span className="material-symbols-outlined text-white text-[16px]">eco</span>
                            <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                                {lichAmDuong.tiet_khi.name}
                            </span>
                        </div>
                        <p className="text-[11px] text-white/60 mb-2 font-medium pl-1">
                            {lichAmDuong.tiet_khi.range}
                        </p>

                        {/* Nạp Âm - Optimized: Removed outer parentheses */}
                        <h2 className="text-2xl font-bold text-white mb-1.5 leading-tight flex flex-col items-start gap-1">
                            <span>{nguHanh.ngay_menh.label}</span>
                            <span className="text-base font-medium opacity-80 text-white">
                                {nguHanh.ngay_menh.element}
                            </span>
                        </h2>
                        <div className="inline-block px-2 py-0.5 rounded bg-white/10 border border-white/5">
                            <p className="text-xs text-white/90 font-medium">
                                Niên mệnh: {nguHanh.nien_menh}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Relations Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                    {/* Hợp */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-[20px] p-4 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-500 text-[20px]">handshake</span>
                            <span className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wide">Tương Hợp</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-baseline text-xs">
                                <span className="text-gray-500 dark:text-blue-200/60 font-medium">Tam hợp</span>
                                <span className="font-bold text-gray-800 dark:text-blue-100 text-sm">{nguHanh.hop_xung.tam_hop.join('-')}</span>
                            </div>
                            <div className="flex justify-between items-baseline text-xs">
                                <span className="text-gray-500 dark:text-blue-200/60 font-medium">Lục hợp</span>
                                <span className="font-bold text-gray-800 dark:text-blue-100 text-sm">{nguHanh.hop_xung.luc_hop.join(', ')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Xung/Khắc */}
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-[20px] p-4 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="material-symbols-outlined text-red-600 dark:text-red-500 text-[20px]">block</span>
                            <span className="text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-wide">Xung Khắc</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-baseline text-xs">
                                <span className="text-gray-500 dark:text-red-200/60 font-medium">Xung</span>
                                <span className="font-bold text-gray-800 dark:text-red-100 text-sm">{nguHanh.hop_xung.xung.join(', ')}</span>
                            </div>
                            <div className="flex justify-between items-baseline text-xs">
                                <span className="text-gray-500 dark:text-red-200/60 font-medium">Hình/Hại</span>
                                <span className="font-bold text-gray-800 dark:text-red-100 text-sm">{[...nguHanh.hop_xung.hinh, ...nguHanh.hop_xung.hai].join(', ') || 'Không'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Detailed Conflict Lists */}
                <div className="space-y-3 mb-6">
                    {/* Nạp Âm Kỵ Tuổi */}
                    <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-[18px] p-4 border border-gray-100 dark:border-zinc-800 transition-colors">
                        <h4 className="text-[11px] font-bold text-gray-500 dark:text-zinc-500 uppercase mb-1.5 flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-orange-500"></span> Nạp Âm Kỵ Tuổi
                        </h4>
                        <p className="text-sm font-bold text-gray-900 dark:text-zinc-200 leading-relaxed">
                            {nguHanh.nap_am_ky_tuoi.join(', ')}
                        </p>
                    </div>

                    {/* Tam Sát */}
                    <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-[18px] p-4 border border-gray-100 dark:border-zinc-800 transition-colors">
                        <h4 className="text-[11px] font-bold text-gray-500 dark:text-zinc-500 uppercase mb-1.5 flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-gray-500"></span> Tam Sát Kỵ Mệnh
                        </h4>
                        <p className="text-sm font-bold text-gray-900 dark:text-zinc-200 leading-relaxed">
                            {nguHanh.hop_xung.tam_sat_ky_menh.join(', ')}
                        </p>
                    </div>
                </div>

                {/* 4. Lucky Hours Grid */}
                <div>
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-green"></div>
                        <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">Giờ Hoàng Đạo</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {luckyHours.map((h) => (
                            <div key={h} className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl py-2 px-1 text-center shadow-sm hover:border-accent-green dark:hover:border-accent-green transition-all cursor-default">
                                <span className="block text-xs font-bold text-gray-800 dark:text-zinc-200 mb-0.5">{HOUR_NAMES[h]}</span>
                                <span className="block text-[10px] font-medium text-gray-500 dark:text-zinc-500">{HOUR_RANGES[h]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(FateOverviewCard);
