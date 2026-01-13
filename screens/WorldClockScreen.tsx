import React from 'react';

const WorldClockScreen: React.FC = () => {
    return (
        <div className="min-h-screen bg-bg-base flex flex-col pb-24">
             <header className="flex items-center justify-between px-6 py-4 shrink-0 z-10">
                <button className="flex items-center justify-center size-10 rounded-full bg-white shadow-sm border border-black/5 text-primary">
                    <span className="material-symbols-outlined text-[24px]">calendar_month</span>
                </button>
                <h2 className="text-lg font-bold tracking-tight text-primary">Giờ Kết Nối</h2>
                <button className="text-primary font-semibold text-sm px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                    Sửa
                </button>
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar pb-28">
                <section className="flex flex-col items-center justify-center py-8 relative">
                    <div className="absolute size-64 bg-primary/10 rounded-full blur-3xl -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="text-center space-y-2">
                        <div className="flex items-center justify-center mb-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/10 text-primary text-xs font-bold tracking-wide uppercase shadow-sm">
                                <span className="material-symbols-outlined text-[14px] filled-icon">location_on</span>
                                Hiện tại
                            </span>
                        </div>
                        <h1 className="text-primary text-[76px] font-bold leading-none tracking-tight tabular-nums drop-shadow-sm">14:30</h1>
                        <h2 className="text-xl font-semibold text-text-main pt-1">Hà Nội, Việt Nam</h2>
                        <div className="flex items-center justify-center gap-3 pt-2">
                            <p className="text-sm font-medium text-text-secondary bg-white px-3 py-1 rounded-full border border-black/5">Thứ Ba, 24/10</p>
                            <p className="text-sm font-bold text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">10/09 AL</p>
                        </div>
                    </div>
                </section>

                <section className="px-5 space-y-4">
                    <div className="px-1 flex justify-between items-end mb-2">
                        <p className="text-xs font-bold text-text-secondary/70 uppercase tracking-wider">Mạng lưới kết nối</p>
                    </div>

                    {/* London Card */}
                    <div className="group relative flex flex-col p-5 bg-white rounded-[24px] shadow-card border border-gray-100 hover:border-primary/30 transition-all duration-300">
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center size-16 rounded-2xl bg-orange-50 text-orange-500 shrink-0 shadow-sm border border-orange-100">
                                    <span className="material-symbols-outlined filled-icon text-[36px]">sunny</span>
                                </div>
                                <div className="flex flex-col pt-1">
                                    <span className="text-lg font-bold text-text-main leading-tight">London</span>
                                    <div className="flex items-center gap-2 text-sm font-medium text-text-secondary mt-1">
                                        <span className="text-xs">Hôm nay</span>
                                        <span className="size-1 bg-current rounded-full opacity-30"></span>
                                        <span className="text-primary font-bold bg-primary/5 px-1.5 py-0.5 rounded text-xs">-6h</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right pt-1">
                                <p className="text-4xl font-bold text-primary tracking-tight tabular-nums leading-none">08:30</p>
                                <p className="text-xs font-medium text-text-secondary/80 mt-1">Sáng</p>
                            </div>
                        </div>
                        <div className="mt-3 p-3 bg-primary/10 rounded-2xl flex items-start gap-2.5">
                            <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">check_circle</span>
                            <span className="text-sm text-primary font-medium leading-tight">Giờ Thìn - Thích hợp gọi điện & trao đổi.</span>
                        </div>
                    </div>

                    {/* New York Card */}
                    <div className="group relative flex flex-col p-5 bg-white rounded-[24px] shadow-card border border-gray-100 hover:border-primary/30 transition-all duration-300">
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center size-16 rounded-2xl bg-indigo-50 text-indigo-500 shrink-0 shadow-sm border border-indigo-100">
                                    <span className="material-symbols-outlined filled-icon text-[36px]">bedtime</span>
                                </div>
                                <div className="flex flex-col pt-1">
                                    <span className="text-lg font-bold text-text-main leading-tight">New York</span>
                                    <div className="flex items-center gap-2 text-sm font-medium text-text-secondary mt-1">
                                        <span className="text-xs">Hôm nay</span>
                                        <span className="size-1 bg-current rounded-full opacity-30"></span>
                                        <span className="text-primary font-bold bg-primary/5 px-1.5 py-0.5 rounded text-xs">-11h</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right pt-1">
                                <p className="text-4xl font-bold text-primary tracking-tight tabular-nums leading-none">03:30</p>
                                <p className="text-xs font-medium text-text-secondary/80 mt-1">Sáng sớm</p>
                            </div>
                        </div>
                        <div className="mt-3 p-3 bg-primary/10 rounded-2xl flex items-start gap-2.5">
                            <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">nights_stay</span>
                            <span className="text-sm text-primary font-medium leading-tight">Giờ Dần - Đêm khuya, không nên làm phiền.</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default WorldClockScreen;