
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const ScheduleSheet: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section className="
            bg-bg-surface/90 dark:bg-zinc-900/90 backdrop-blur-xl 
            -mx-4 px-4 pt-2 pb-8 rounded-t-[32px] shadow-sheet border-t border-white/60 dark:border-zinc-800 
            mt-2 relative z-30 ring-1 ring-black/5 dark:ring-white/5 animate-[slideUp_0.5s_ease-out]
            
            md:mx-0 md:rounded-3xl md:shadow-card md:border md:border-gray-100 md:dark:border-zinc-800 md:bg-white md:dark:bg-zinc-900 md:mt-0 md:p-5 md:pt-5
        ">
            {/* Drag Handle (Mobile Only) */}
            <div className="w-full flex justify-center pt-3 pb-6 cursor-grab active:cursor-grabbing group md:hidden">
                <div className="w-16 h-1.5 bg-gray-300/80 dark:bg-zinc-600 rounded-full group-hover:bg-gray-400 transition-colors"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
                    {t('home.schedule')}
                    <span className="flex items-center justify-center size-6 bg-accent-green text-white rounded-full text-[11px] font-bold shadow-sm">3</span>
                </h2>
                <button className="text-accent-green text-xs font-bold uppercase hover:bg-accent-green/10 px-3 py-2 rounded-xl transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    {t('home.add_new')}
                </button>
            </div>

            {/* Timeline List */}
            <div className="flex flex-col gap-4">
                {/* Event 1 */}
                <div className="flex group">
                    <div className="flex flex-col items-end pr-3.5 w-[3.5rem] pt-1.5">
                        <span className="text-sm font-bold text-text-main">09:00</span>
                        <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold tracking-wide">AM</span>
                    </div>
                    <div className="flex-1 relative pl-4 py-3 border-l-[3px] border-blue-500 bg-white dark:bg-zinc-800 rounded-r-2xl shadow-soft flex flex-col gap-1 ring-1 ring-gray-100/80 dark:ring-zinc-700/50 hover:ring-blue-100 dark:hover:ring-blue-900 transition-all">
                        <h4 className="text-sm font-bold text-text-main">Họp Daily Team</h4>
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px] text-blue-500">videocam</span>
                            <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">Google Meet</span>
                        </div>
                    </div>
                </div>

                {/* Event 2 */}
                <div className="flex group">
                    <div className="flex flex-col items-end pr-3.5 w-[3.5rem] pt-1.5">
                        <span className="text-sm font-bold text-text-main">14:30</span>
                        <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold tracking-wide">PM</span>
                    </div>
                    <div className="flex-1 relative pl-4 py-3 border-l-[3px] border-accent-green bg-white dark:bg-zinc-800 rounded-r-2xl shadow-soft flex flex-col gap-1 ring-1 ring-gray-100/80 dark:ring-zinc-700/50 hover:ring-green-100 dark:hover:ring-green-900 transition-all">
                        <h4 className="text-sm font-bold text-text-main">Gửi báo cáo tháng</h4>
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px] text-accent-green">check_box</span>
                            <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">Tasks</span>
                        </div>
                    </div>
                </div>

                {/* Tomorrow Separator */}
                <div className="mt-2">
                    <div className="text-[10px] font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-widest ml-[3.5rem] pl-1 mb-3 flex items-center gap-2">
                        Ngày mai <span className="h-px w-full bg-gray-200 dark:bg-zinc-800"></span>
                    </div>
                    
                    {/* Event 3 */}
                    <div className="flex group opacity-80 hover:opacity-100 transition-opacity">
                        <div className="flex flex-col items-end pr-3.5 w-[3.5rem] pt-1.5">
                            <span className="text-sm font-bold text-text-main">10:00</span>
                            <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold tracking-wide">AM</span>
                        </div>
                        <div className="flex-1 relative pl-4 py-3 border-l-[3px] border-orange-400 bg-white dark:bg-zinc-800 rounded-r-2xl shadow-soft flex flex-col gap-1 ring-1 ring-gray-100/80 dark:ring-zinc-700/50">
                            <h4 className="text-sm font-bold text-text-main">Lấy đồ giặt ủi</h4>
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px] text-orange-400">person</span>
                                <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">Cá nhân</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default React.memo(ScheduleSheet);
