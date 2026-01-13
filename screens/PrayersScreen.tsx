import React from 'react';

const PrayersScreen: React.FC = () => {
    return (
        <div className="bg-bg-base text-text-main min-h-screen flex flex-col pb-24">
             <header className="sticky top-0 z-50 bg-bg-base/95 backdrop-blur-sm border-b border-gray-200">
                <div className="flex items-center p-4 pb-2 justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <button className="flex items-center justify-center w-8 h-8 -ml-2 rounded-full hover:bg-primary/10 text-primary transition-colors">
                            <span className="material-symbols-outlined text-2xl">arrow_back</span>
                        </button>
                        <h2 className="text-text-main text-lg font-bold leading-tight tracking-tight truncate">Văn Khấn Mùng 1</h2>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                        <span className="text-primary text-lg font-bold tabular-nums tracking-wide">10:28</span>
                        <button className="flex cursor-pointer items-center justify-center rounded-full w-10 h-10 hover:bg-primary/10 transition-colors text-primary">
                            <span className="material-symbols-outlined text-2xl">more_vert</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full flex flex-col p-3 sm:p-4 max-w-3xl mx-auto gap-4">
                <article className="bg-paper rounded-xl shadow-card border border-[#e8e4dc] overflow-hidden flex flex-col relative h-full flex-1">
                     <div className="flex items-center justify-between p-3 px-5 border-b border-[#eeeae4] bg-paper/95 backdrop-blur sticky top-0 z-10">
                        <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Hiển thị</span>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center justify-center w-11 h-11 rounded-full border border-primary/20 bg-white/60 hover:bg-primary hover:text-white transition-all text-primary">
                                <span className="font-bold text-sm mr-0.5">A</span>
                                <span className="material-symbols-outlined text-base">remove</span>
                            </button>
                            <button className="flex items-center justify-center w-11 h-11 rounded-full border border-primary/20 bg-white/60 hover:bg-primary hover:text-white transition-all text-primary">
                                <span className="font-bold text-lg mr-0.5">A</span>
                                <span className="material-symbols-outlined text-lg">add</span>
                            </button>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8 overflow-y-auto flex-1 font-body">
                         <div className="text-center mb-8">
                            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-4 leading-tight font-display">Văn Khấn Mùng 1<br/><span className="text-lg font-medium opacity-80 mt-1 block text-text-secondary font-body">Gia tiên, Thần linh</span></h1>
                            <div className="flex flex-wrap justify-center gap-2 font-display">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0ede6] text-primary text-xs font-bold border border-primary/10">
                                    <span className="material-symbols-outlined text-[16px]">home</span>
                                    Tại gia
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0ede6] text-primary text-xs font-bold border border-primary/10">
                                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                                    Hàng tháng
                                </div>
                            </div>
                        </div>

                        <div className="prose max-w-none text-text-main">
                             <div className="mb-10 relative pl-4 border-l-4 border-primary/20">
                                <span className="text-primary block mb-2 text-sm font-bold uppercase tracking-wider opacity-90 flex items-center gap-2 font-display">
                                    <span className="material-symbols-outlined text-lg">spa</span> Niệm Hương
                                </span>
                                <p className="text-lg leading-relaxed font-medium italic">
                                    Nam mô A Di Đà Phật! (3 lần)<br/>
                                    Con lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.
                                </p>
                            </div>

                            <div className="mb-10">
                                <span className="text-primary block mb-3 text-sm font-bold uppercase tracking-wider opacity-90 flex items-center gap-2 border-b border-primary/10 pb-2 font-display">
                                    <span className="material-symbols-outlined text-lg">person_celebrate</span> Kính Lạy
                                </span>
                                <p className="text-lg leading-loose">
                                    Con kính lạy Hoàng thiên, Hậu Thổ chư vị Tôn thần.<br/>
                                    Con kính lạy ngài Đông trù Tư mệnh Táo phủ Thần quân.<br/>
                                    Con kính lạy các ngài Thần linh cai quản trong xứ này.<br/>
                                    Con kính lạy Tổ tiên nội ngoại họ: ......................
                                </p>
                            </div>
                        </div>
                        
                        <div className="mt-10 pt-6 border-t border-primary/10 flex justify-center pb-4">
                            <button className="group relative flex items-center gap-3 text-white font-bold text-lg px-8 py-4 rounded-full bg-primary hover:bg-primary-dark shadow-glow hover:-translate-y-0.5 active:translate-y-0 transition-all font-display">
                                <span className="material-symbols-outlined text-2xl animate-pulse">filter_vintage</span>
                                <span>Hoàn tất & Nhận Sen</span>
                            </button>
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
};

export default PrayersScreen;