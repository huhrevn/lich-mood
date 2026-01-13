
import React, { useState } from 'react';
import { JournalEntry } from '../types/journalTypes';
import { analyzeJournalEntry } from '../services/aiJournalService';

// --- MOCK DATA ---
const INITIAL_ENTRIES: JournalEntry[] = [
    {
        id: '1',
        date: new Date(2024, 3, 12), // April 12
        title: 'Ngày làm việc hiệu quả',
        mood: 'happy',
        originalContent: 'Hôm nay làm được nhiều việc quá.',
        image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=2072',
        aiData: {
            summary_emotion: 'Tích cực',
            content_refined: 'Hôm nay là một ngày thực sự năng suất! Mình đã dậy sớm từ 6h sáng, chạy bộ 30 phút quanh công viên. Không khí buổi sáng thật trong lành, giúp mình tỉnh táo hơn hẳn so với việc ngủ nướng. Đến công ty, mình bắt tay ngay vào việc xử lý các task tồn đọng.',
            quote: 'Thành công không phải là đích đến, mà là cả một hành trình.',
            key_points: ['Dậy sớm chạy bộ', 'Hoàn thành task tồn đọng', 'Ăn trưa vui vẻ cùng đồng nghiệp'],
            improvements: ['Ngủ sớm hơn vào tối nay', 'Uống nhiều nước hơn'],
            hashtags: ['#worklife', '#motivation', '#daily']
        }
    },
    {
        id: '2',
        date: new Date(2024, 3, 11),
        title: 'Cơn mưa rào bất chợt',
        mood: 'neutral',
        originalContent: 'Mưa to quá, ướt hết.',
        aiData: {
            summary_emotion: 'Trung lập',
            content_refined: 'Chiều nay trời đổ mưa rào bất chợt. Dù bị ướt một chút nhưng cảm giác không khí dịu lại sau những ngày nắng gắt cũng khá thú vị. Về nhà sớm, cuộn mình trong chăn đọc sách.',
            quote: 'Sau cơn mưa trời lại sáng.',
            key_points: ['Mưa rào buổi chiều', 'Về nhà sớm đọc sách', 'Cảm thấy bình yên'],
            improvements: ['Luôn mang theo ô', 'Kiểm tra dự báo thời tiết'],
            hashtags: ['#rainyday', '#chill', '#reading']
        }
    }
];

const JournalScreen: React.FC = () => {
    // State
    const [activeTab, setActiveTab] = useState<'dashboard' | 'list'>('dashboard');
    const [entries, setEntries] = useState<JournalEntry[]>(INITIAL_ENTRIES);
    
    // Editor State
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [rawInput, setRawInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResult, setGeneratedResult] = useState<JournalEntry | null>(null);

    // Handlers
    const handleCreate = async () => {
        if (!rawInput.trim()) return;
        setIsGenerating(true);
        
        try {
            const aiResult = await analyzeJournalEntry(rawInput);
            const newEntry: JournalEntry = {
                id: Date.now().toString(),
                date: new Date(),
                title: 'Nhật ký hôm nay', // Could be AI generated too
                originalContent: rawInput,
                mood: aiResult.summary_emotion.toLowerCase().includes('tích cực') ? 'happy' : 'neutral',
                aiData: aiResult
            };
            setGeneratedResult(newEntry);
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveEntry = () => {
        if (generatedResult) {
            setEntries([generatedResult, ...entries]);
            setIsEditorOpen(false);
            setGeneratedResult(null);
            setRawInput('');
            setActiveTab('list'); // Switch to list to see new entry
        }
    };

    return (
        <div className="min-h-screen bg-bg-base flex flex-col pb-24 font-display">
             {/* Header */}
             <header className="sticky top-0 z-40 bg-bg-base/95 backdrop-blur-md border-b border-gray-100 pt-6 pb-3 px-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                     <div className="size-10 rounded-full overflow-hidden border border-gray-200 ring-2 ring-white shadow-sm">
                        <img src="https://ui-avatars.com/api/?name=Minh+Anh&background=4A7B4F&color=fff" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-text-secondary font-medium">Xin chào,</span>
                        <span className="text-base font-bold text-text-main leading-tight">Minh Anh</span>
                    </div>
                </div>
                
                {/* Tab Switcher */}
                <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl">
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'dashboard' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
                    >
                        Sổ Tay
                    </button>
                    <button 
                        onClick={() => setActiveTab('list')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
                    >
                        Nhật Ký
                    </button>
                </div>
            </header>

            <main className="p-4 md:p-6 max-w-5xl mx-auto w-full">
                
                {/* VIEW 1: DASHBOARD (Sổ Tay Tu Tập) */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                        <h1 className="text-2xl font-bold text-primary tracking-tight">Sổ Tay Tu Tập</h1>
                        
                        {/* 1. Lotus Garden */}
                        <section className="bg-white dark:bg-zinc-900 rounded-[24px] shadow-card dark:shadow-none border border-gray-100 dark:border-zinc-800 overflow-hidden">
                             <div className="p-5 border-b border-gray-50 dark:border-zinc-800 flex justify-between items-center">
                                <div>
                                    <h2 className="text-base font-bold text-primary flex items-center gap-2">
                                        <span className="material-symbols-outlined text-xl filled-icon">spa</span>
                                        Vườn Công Đức
                                    </h2>
                                    <p className="text-xs text-gray-500 mt-1">Gieo nhân lành, gặt quả ngọt</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary tabular-nums">12 <span className="text-xs text-gray-400 font-medium">/ 30</span></div>
                                </div>
                            </div>
                            
                            <div className="p-6 bg-gradient-to-b from-green-50/50 to-white dark:from-green-900/10 dark:to-zinc-900">
                                <div className="grid grid-cols-6 gap-y-6 gap-x-2">
                                    {Array.from({ length: 30 }).map((_, i) => {
                                        const isBloomed = i < 12;
                                        return (
                                            <div key={i} className="flex justify-center">
                                                {isBloomed ? (
                                                    <div className="flex flex-col items-center gap-1 animate-[float_3s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.1}s` }}>
                                                        <span className="material-symbols-outlined text-lotus-pink text-2xl drop-shadow-sm filled-icon">spa</span>
                                                        <div className="w-4 h-1 bg-black/5 blur-[2px] rounded-full"></div>
                                                    </div>
                                                ) : (
                                                    <span className="material-symbols-outlined text-gray-200 dark:text-zinc-700 text-xl">spa</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-6 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-lotus-pink"></span> Cấp độ: Sơ Tâm</span>
                                    <span>Mục tiêu: 30 đóa sen</span>
                                </div>
                            </div>
                        </section>

                        {/* 2. Streak Circle */}
                        <section className="bg-gradient-to-br from-[#EBF5EF] to-[#F7FAF8] dark:from-zinc-800 dark:to-zinc-900 rounded-[32px] p-8 shadow-inner border border-white/50 dark:border-zinc-700 relative overflow-hidden">
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="relative size-48 mb-6">
                                    {/* SVG Circle */}
                                    <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="6" className="text-white dark:text-zinc-700 shadow-sm" />
                                        <circle cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="6" strokeDasharray="283" strokeDashoffset="250" strokeLinecap="round" className="text-primary drop-shadow-md transition-all duration-1000 ease-out" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl text-primary mb-1 filled-icon">local_florist</span>
                                        <div className="text-5xl font-extrabold text-primary tabular-nums tracking-tighter">3</div>
                                        <div className="text-sm font-semibold text-gray-400">ngày</div>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-text-main mb-2">Chuỗi Tinh Tấn</h3>
                                <p className="text-sm text-center text-gray-500 max-w-xs mb-8">
                                    Bạn đang làm rất tốt! Duy trì thêm <strong className="text-primary">4 ngày</strong> để nhận huy hiệu tuần.
                                </p>

                                <button 
                                    onClick={() => setIsEditorOpen(true)}
                                    className="w-full max-w-md bg-[#3A633F] hover:bg-[#2e4f32] text-white py-4 rounded-2xl font-bold text-lg shadow-glow hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">check_circle</span>
                                    Hoàn thành hôm nay
                                </button>
                            </div>
                        </section>
                    </div>
                )}

                {/* VIEW 2: JOURNAL LIST (Danh sách) */}
                {activeTab === 'list' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-[slideUp_0.4s_ease-out]">
                        
                        {/* Sidebar List (Dates) - Desktop Only or Top Scroll Mobile */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-lg text-text-main">Danh sách</h3>
                                <button className="size-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500">
                                    <span className="material-symbols-outlined text-lg">filter_list</span>
                                </button>
                            </div>

                            <div className="flex flex-col gap-3">
                                {entries.map(entry => (
                                    <div key={entry.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 cursor-pointer hover:border-primary/50 transition-all group">
                                        <div className="flex items-start gap-4">
                                            <div className="flex flex-col items-center bg-gray-50 dark:bg-zinc-800 rounded-xl p-2 min-w-[3.5rem] border border-gray-100 dark:border-zinc-700">
                                                <span className="text-[10px] uppercase font-bold text-gray-400">Thứ {entry.date.getDay() + 1}</span>
                                                <span className="text-2xl font-bold text-text-main">{entry.date.getDate()}</span>
                                                <span className="text-[10px] font-medium text-gray-400">T{entry.date.getMonth() + 1}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-text-main truncate group-hover:text-primary transition-colors">{entry.title}</h4>
                                                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{entry.aiData?.content_refined || entry.originalContent}</p>
                                                <div className="flex gap-2 mt-2">
                                                    {entry.aiData?.hashtags.slice(0, 2).map((tag, i) => (
                                                        <span key={i} className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Detail View (Main Content) */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Editor Trigger (if in list mode) */}
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-dashed border-gray-300 dark:border-zinc-700 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setIsEditorOpen(true)}>
                                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">edit_note</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-main">Viết nhật ký mới</h3>
                                    <p className="text-xs text-gray-500">Ghi lại cảm xúc hôm nay để AI giúp bạn phân tích...</p>
                                </div>
                            </div>

                            {/* Render Latest Entry Full */}
                            {entries.length > 0 && (
                                <div className="bg-white dark:bg-zinc-900 rounded-[24px] overflow-hidden shadow-card dark:shadow-none border border-gray-100 dark:border-zinc-800">
                                    {entries[0].image && (
                                        <div className="h-48 md:h-64 w-full relative">
                                            <img src={entries[0].image} alt="Cover" className="w-full h-full object-cover" />
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-text-main shadow-sm flex items-center gap-1">
                                                <span className="material-symbols-outlined text-yellow-500 text-sm filled-icon">sentiment_satisfied</span>
                                                {entries[0].aiData?.summary_emotion}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="p-6 md:p-8">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-bold border border-green-100">
                                                {entries[0].date.getDate()} <span className="text-xs font-normal">tháng {entries[0].date.getMonth() + 1}</span>
                                            </div>
                                            <h2 className="text-2xl font-serif font-bold text-text-main">{entries[0].title}</h2>
                                        </div>

                                        {entries[0].aiData && (
                                            <>
                                                <div className="prose prose-sm max-w-none text-text-secondary leading-relaxed mb-6 font-display">
                                                    <p>{entries[0].aiData.content_refined}</p>
                                                </div>

                                                <div className="bg-[#F7F9F8] dark:bg-zinc-800/50 rounded-xl p-5 border-l-4 border-primary mb-6 relative">
                                                    <span className="material-symbols-outlined absolute top-4 left-4 text-primary/20 text-4xl">format_quote</span>
                                                    <p className="text-primary font-serif italic font-medium relative z-10 pl-8">"{entries[0].aiData.quote}"</p>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Điểm nhấn</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {entries[0].aiData.key_points.map((pt, i) => (
                                                                <span key={i} className="inline-flex items-center gap-1 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-sm text-text-main shadow-sm">
                                                                    <span className="size-1.5 rounded-full bg-accent-gold"></span>
                                                                    {pt}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    
                                                    <div>
                                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hashtags</h4>
                                                        <div className="flex gap-2">
                                                            {entries[0].aiData.hashtags.map((tag, i) => (
                                                                <span key={i} className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{tag}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    
                                    {/* Action Bar */}
                                    <div className="px-6 py-4 border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-2">
                                        <button className="size-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button className="size-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
                                            <span className="material-symbols-outlined text-[20px]">share</span>
                                        </button>
                                        <button className="size-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* EDITOR MODAL */}
            {isEditorOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out]">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900 shrink-0">
                            <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">edit_note</span>
                                Viết Nhật Ký
                            </h2>
                            <button onClick={() => setIsEditorOpen(false)} className="size-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-zinc-950/50">
                            {!generatedResult ? (
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hôm nay của bạn thế nào?</label>
                                    <textarea 
                                        autoFocus
                                        className="w-full h-64 p-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none text-base leading-relaxed"
                                        placeholder="Kể về một sự kiện, cảm xúc hay suy nghĩ của bạn..."
                                        value={rawInput}
                                        onChange={(e) => setRawInput(e.target.value)}
                                    ></textarea>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                                        AI sẽ giúp bạn tinh chỉnh văn phong và trích xuất ý nghĩa.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                                     {/* AI Result Preview */}
                                     <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 border border-primary/20 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                            <span className="material-symbols-outlined text-6xl text-primary">psychology</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-primary uppercase tracking-wide mb-3 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-lg">auto_awesome</span> Kết quả phân tích
                                        </h3>
                                        
                                        <div className="prose prose-sm text-text-main mb-4">
                                            <p>{generatedResult.aiData?.content_refined}</p>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {generatedResult.aiData?.key_points.map((pt, i) => (
                                                <span key={i} className="text-xs bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 font-medium">• {pt}</span>
                                            ))}
                                        </div>

                                        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-100 dark:border-orange-800/30">
                                            <span className="block text-[10px] font-bold text-orange-600 uppercase mb-1">💡 Gợi ý cải thiện</span>
                                            <ul className="list-disc list-inside text-xs text-orange-800 dark:text-orange-200">
                                                {generatedResult.aiData?.improvements.map((imp, i) => (
                                                    <li key={i}>{imp}</li>
                                                ))}
                                            </ul>
                                        </div>
                                     </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-end gap-3 shrink-0">
                            {!generatedResult ? (
                                <button 
                                    onClick={handleCreate}
                                    disabled={!rawInput.trim() || isGenerating}
                                    className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-glow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Đang suy nghĩ...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">auto_awesome</span>
                                            AI Phân Tích
                                        </>
                                    )}
                                </button>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => setGeneratedResult(null)}
                                        className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg"
                                    >
                                        Viết lại
                                    </button>
                                    <button 
                                        onClick={handleSaveEntry}
                                        className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold shadow-glow transition-all flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">check</span>
                                        Lưu Nhật Ký
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default JournalScreen;
