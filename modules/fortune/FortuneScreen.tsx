
import React from 'react';
import { useFortuneLogic } from './fortune.logic';
import BambooShaker from './components/BambooShaker';

const FortuneScreen: React.FC = () => {
    const {
        isShaking, result, history,
        handleShake, resetFortune, handlePin, handleDelete, handleClearAll, setResult
    } = useFortuneLogic();

    return (
        <>
            {/* ================= MOBILE VIEW ================= */}
            <div className="md:hidden min-h-screen bg-bg-base relative overflow-hidden pb-28 pt-4">
                <div className="fixed top-0 left-0 w-full z-40 pt-4 pb-2 px-6 flex items-center justify-between bg-bg-base/90 backdrop-blur-md">
                    <button className="size-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-text-main">
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </button>
                    <div className="text-center">
                        <h1 className="text-lg font-bold text-primary">Xin Xăm</h1>
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold">Gieo quẻ Thánh</p>
                    </div>
                    <button className="size-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-text-main">
                        <span className="material-symbols-outlined text-2xl">history</span>
                    </button>
                </div>

                <div className="h-full flex flex-col items-center pt-24 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[55%] bg-gradient-to-b from-primary/10 to-transparent rounded-b-[100%] pointer-events-none z-0"></div>

                    <div className="relative z-10 w-full flex flex-col items-center flex-1 min-h-[400px]">
                        <div className="mb-8 text-center animate-pulse">
                            <button
                                onClick={handleShake}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/70 backdrop-blur rounded-full border border-white/60 shadow-lg hover:shadow-xl transition-all active:scale-95 group"
                            >
                                <span className="material-symbols-outlined text-primary text-xl group-hover:rotate-12 transition-transform">vibration</span>
                                <span className="text-sm font-semibold text-primary">{isShaking ? 'Đang lắc...' : 'Lắc điện thoại để xin xăm'}</span>
                            </button>
                        </div>
                        <div className="mt-2">
                            <BambooShaker isShaking={isShaking} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= DESKTOP VIEW ================= */}
            <div className="hidden md:grid grid-cols-12 gap-6 h-full p-4 md:p-0">
                <div className="col-span-12 lg:col-span-8 bg-white dark:bg-zinc-900 rounded-[32px] shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden p-10 min-h-[600px]">
                    {!result ? (
                        <div className="flex flex-col items-center z-10 animate-[fadeIn_0.3s_ease-out]">
                            <div className="mb-6">
                                <BambooShaker isShaking={isShaking} />
                            </div>

                            <h1 className="text-3xl font-bold text-text-main mb-3 tracking-tight">Gieo Quẻ Quan Âm</h1>
                            <p className="text-text-secondary text-center max-w-md mb-8 text-base leading-relaxed">
                                "Lòng thành thắp nén tâm hương.<br />
                                Cầu xin Bồ Tát chỉ đường độ mê."
                            </p>

                            <button
                                onClick={handleShake}
                                disabled={isShaking || result}
                                className="bg-accent-green hover:bg-primary-dark text-white pl-6 pr-8 py-4 rounded-2xl font-bold text-lg shadow-glow hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <span className={`material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform ${isShaking ? 'animate-spin' : ''}`}>vibration</span>
                                {isShaking ? 'Đang gieo quẻ...' : 'Lắc Ống Xâm'}
                            </button>

                            <p className="mt-4 text-xs font-medium text-gray-400 dark:text-zinc-500 italic">
                                Nhấn nút để bắt đầu gieo quẻ
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center w-full max-w-xl animate-[slideUp_0.4s_ease-out] relative z-20">
                            <div className="bg-white dark:bg-zinc-800 rounded-3xl p-8 shadow-card border border-stone-100 dark:border-zinc-700 relative overflow-hidden w-full text-center">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <span className="material-symbols-outlined text-9xl text-primary rotate-12">spa</span>
                                </div>
                                <div className="mb-4 flex justify-center">
                                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${result.type === 'cát' ? 'bg-accent-red' : result.type === 'hung' ? 'bg-gray-500' : 'bg-blue-500'
                                        }`}>
                                        <span className="material-symbols-outlined text-sm">verified</span>
                                        {result.type === 'cát' ? 'Thượng Kiết' : result.type === 'hung' ? 'Hạ Hung' : 'Trung Bình'}
                                    </span>
                                </div>
                                <h2 className="text-4xl font-serif font-bold text-primary mb-2">{result.name}</h2>
                                <div className="flex justify-center items-center gap-2 text-sm text-text-secondary font-medium mb-8">
                                    <span>Gieo lúc: {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span className="size-1 bg-gray-300 rounded-full"></span>
                                    <span>{new Date().toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="w-full py-6 px-4 border-y border-primary/10 dark:border-primary/20 mb-6 bg-primary/5 rounded-lg">
                                    <p className="text-text-main text-xl font-serif italic leading-relaxed">
                                        "{result.poem ? result.poem.join(' / ') : result.summary}"
                                    </p>
                                </div>
                                <div className="text-left w-full bg-gray-50 dark:bg-zinc-900 rounded-xl p-5 border border-stone-100 dark:border-zinc-700 shadow-inner">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="material-symbols-outlined text-primary text-xl">psychology</span>
                                        <h3 className="text-sm font-bold uppercase text-primary tracking-wide">Lời bàn</h3>
                                    </div>
                                    <p className="text-base text-text-main leading-relaxed opacity-90 text-justify">
                                        {result.guidance}
                                    </p>
                                </div>
                                <button onClick={resetFortune} className="mt-8 text-sm font-bold text-primary hover:text-primary-dark underline underline-offset-4 flex items-center justify-center gap-2 mx-auto">
                                    <span className="material-symbols-outlined text-lg">refresh</span>
                                    Xin quẻ khác
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-50/50 via-transparent to-transparent pointer-events-none"></div>
                </div>

                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 h-full">
                    {/* Guide Card (Simplified for refactor) */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2 mb-5">
                            <span className="size-2 rounded-full bg-accent-gold"></span>
                            <h3 className="text-sm font-bold text-text-main uppercase tracking-wide">HƯỚNG DẪN</h3>
                        </div>
                        <ul className="space-y-4">
                            <li className="text-xs text-text-secondary">1. Tịnh tâm, gạt bỏ tạp niệm.</li>
                            <li className="text-xs text-text-secondary">2. Thầm khấn tên tuổi, điều muốn hỏi.</li>
                            <li className="text-xs text-text-secondary">3. Bấm nút lắc ống xăm.</li>
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-zinc-800 flex-1 flex flex-col min-h-[300px]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-text-main uppercase tracking-wide">LỊCH SỬ</h3>
                            {history.length > 0 && (
                                <button onClick={handleClearAll} className="text-[10px] font-bold text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors">XÓA TẤT CẢ</button>
                            )}
                        </div>
                        {history.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                                <p className="text-xs font-medium text-text-secondary">Chưa có quẻ nào</p>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto pr-1 space-y-3 max-h-[400px]">
                                {history.map((item) => (
                                    <div
                                        key={item.uuid}
                                        className="p-3 rounded-xl border flex gap-3 group transition-all cursor-pointer bg-gray-50 border-transparent hover:bg-white hover:border-gray-200"
                                        onClick={() => setResult(item)}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-xs font-bold text-text-main truncate pr-2">{item.name}</h4>
                                                {item.isPinned && <span className="material-symbols-outlined text-[12px] text-accent-gold filled-icon">push_pin</span>}
                                            </div>
                                            <p className="text-[10px] text-text-secondary truncate mt-0.5">{item.summary}</p>
                                        </div>
                                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={(e) => handlePin(item.uuid, e)} className="text-gray-400 hover:text-accent-gold"><span className="material-symbols-outlined text-[14px]">push_pin</span></button>
                                            <button onClick={(e) => handleDelete(item.uuid, e)} className="text-gray-400 hover:text-red-500"><span className="material-symbols-outlined text-[14px]">delete</span></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default FortuneScreen;
