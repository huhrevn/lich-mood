
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
        <div className="w-full bg-white rounded-[24px] shadow-card border border-gray-100 overflow-hidden font-display animate-[slideUp_0.4s_ease-out] mt-4">
            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-2">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#1E4D34] text-xl">auto_awesome</span>
                    <h3 className="text-[15px] font-bold text-gray-800 uppercase tracking-wide">Chi tiết Vận Mệnh</h3>
                </div>
            </div>

            <div className="px-4 pb-5">
                {/* 1. Hero Card: Tiết Khí & Mệnh */}
                <div className={`relative rounded-2xl p-5 mb-4 overflow-hidden ${result.isZodiacDay ? 'bg-[#1E4D34]' : 'bg-gray-800'}`}>
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    
                    <div className="relative z-10">
                        {/* Tiết Khí Badge */}
                        <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 mb-3">
                            <span className="material-symbols-outlined text-white text-[16px]">eco</span>
                            <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                                {lichAmDuong.tiet_khi.name}
                            </span>
                        </div>
                        <p className="text-[10px] text-white/60 mb-3 -mt-1 font-medium pl-1">
                            {lichAmDuong.tiet_khi.range}
                        </p>
                        
                        {/* Nạp Âm - Optimized: Removed outer parentheses */}
                        <h2 className="text-xl font-bold text-white mb-1 leading-tight flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                            <span>{nguHanh.ngay_menh.label}</span>
                            <span className="text-sm sm:text-lg font-medium opacity-90 text-white/90">
                                {nguHanh.ngay_menh.element}
                            </span>
                        </h2>
                        <p className="text-sm text-white/80 leading-relaxed font-medium">
                            Niên mệnh: {nguHanh.nien_menh}
                        </p>
                    </div>
                </div>

                {/* 2. Relations Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Hợp */}
                    <div className="bg-green-50 border border-green-100 rounded-2xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-green-600 text-[18px]">handshake</span>
                            <span className="text-xs font-bold text-green-800 uppercase">Tương Hợp</span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Tam hợp:</span>
                                <span className="font-bold text-gray-800">{nguHanh.hop_xung.tam_hop.join('-')}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Lục hợp:</span>
                                <span className="font-bold text-gray-800">{nguHanh.hop_xung.luc_hop.join(', ')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Xung/Khắc */}
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-red-600 text-[18px]">block</span>
                            <span className="text-xs font-bold text-red-800 uppercase">Xung Khắc</span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Xung:</span>
                                <span className="font-bold text-gray-800">{nguHanh.hop_xung.xung.join(', ')}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Hình/Hại:</span>
                                <span className="font-bold text-gray-800">{[...nguHanh.hop_xung.hinh, ...nguHanh.hop_xung.hai].join(', ') || 'Không'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Detailed Conflict Lists */}
                <div className="space-y-3 mb-5">
                    {/* Nạp Âm Kỵ Tuổi */}
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                         <h4 className="text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-orange-500"></span> Nạp Âm Kỵ Tuổi
                         </h4>
                         <p className="text-sm font-medium text-gray-900 leading-relaxed">
                            {nguHanh.nap_am_ky_tuoi.join(', ')}
                         </p>
                    </div>

                     {/* Tam Sát */}
                     <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                         <h4 className="text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-gray-500"></span> Tam Sát Kỵ Mệnh
                         </h4>
                         <p className="text-sm font-medium text-gray-900 leading-relaxed">
                            {nguHanh.hop_xung.tam_sat_ky_menh.join(', ')}
                         </p>
                    </div>
                </div>

                {/* 4. Lucky Hours Grid */}
                <div>
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1E4D34]"></div>
                        <h4 className="text-[13px] font-bold text-gray-900">Giờ Hoàng Đạo</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {luckyHours.map((h) => (
                            <div key={h} className="bg-white border border-gray-200 rounded-xl py-2 px-1 text-center shadow-sm hover:border-[#1E4D34] transition-all cursor-default">
                                <span className="block text-xs font-bold text-gray-800 mb-0.5">{HOUR_NAMES[h]}</span>
                                <span className="block text-[10px] font-medium text-gray-500">{HOUR_RANGES[h]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(FateOverviewCard);
