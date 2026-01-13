import React, { useState } from 'react';

const GreetingsScreen: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [generated, setGenerated] = useState(false);

    const handleGenerate = () => {
        // Mock generation
        setGenerated(true);
    };

    return (
        <div className="min-h-screen bg-bg-base flex flex-col pb-24">
             {/* Header */}
             <div className="sticky top-0 z-50 bg-bg-base/90 backdrop-blur-md border-b border-gray-200 flex items-center justify-between p-4">
                <button className="w-10 h-10 flex items-center justify-start text-text-main">
                    <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
                </button>
                <h1 className="text-lg font-bold text-text-main">AI Soạn Lời Chúc</h1>
                <div className="w-10 h-10"></div> 
            </div>

            <main className="flex-1 px-4 pt-6 overflow-y-auto no-scrollbar">
                <section className="mb-6">
                    <h2 className="text-xl font-bold text-text-main mb-3">Bạn muốn chúc gì?</h2>
                    <div className="bg-bg-surface rounded-2xl shadow-sm border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 group">
                        <textarea 
                            className="w-full bg-transparent border-none p-4 min-h-[100px] resize-none text-base text-text-main placeholder-gray-400 focus:ring-0 leading-relaxed" 
                            placeholder="Nhập chủ đề (ví dụ: Chúc sếp thăng tiến, năm mới phát tài)..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        ></textarea>
                        <div className="px-4 pb-3 flex justify-end">
                            <span className="text-xs text-gray-400 font-medium">0/200</span>
                        </div>
                    </div>
                </section>

                <div className="space-y-5 mb-8">
                    <section>
                        <div className="flex items-center gap-2 mb-2 px-1">
                            <span className="material-symbols-outlined text-lg text-primary">person</span>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Đối tượng</h3>
                        </div>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                            {['Sếp', 'Người yêu', 'Gia đình', 'Bạn bè'].map((item, idx) => (
                                <button key={idx} className={`shrink-0 h-8 px-4 rounded-full text-sm font-medium border transition-all ${idx === 0 ? 'bg-primary text-white border-transparent shadow-md' : 'bg-white border-gray-200 text-gray-600'}`}>
                                    {item}
                                </button>
                            ))}
                            <button className="shrink-0 h-8 w-8 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center">
                                <span className="material-symbols-outlined text-lg">add</span>
                            </button>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-2 px-1">
                            <span className="material-symbols-outlined text-lg text-primary">style</span>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Phong cách</h3>
                        </div>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                             {['Trang trọng', 'Hài hước', 'Chân thành', 'Thơ'].map((item, idx) => (
                                <button key={idx} className={`shrink-0 h-8 px-4 rounded-full text-sm font-medium border transition-all ${idx === 1 ? 'bg-primary/10 border-primary text-primary flex items-center gap-1' : 'bg-white border-gray-200 text-gray-600'}`}>
                                    {idx === 1 && <span className="material-symbols-outlined text-[16px] filled-icon">sentiment_satisfied</span>}
                                    {item}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                <button 
                    onClick={handleGenerate}
                    className="w-full bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl py-4 px-6 shadow-glow transition-all active:scale-[0.98] mb-8 flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined animate-bounce">auto_awesome</span>
                    <span className="font-bold text-lg">AI Viết Lời Chúc</span>
                </button>

                {generated && (
                    <section className="relative animate-fade-in-up">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Kết quả đề xuất
                            </h3>
                            <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Sáng tạo bởi AI</span>
                        </div>
                        <div className="bg-bg-surface rounded-2xl p-1 shadow-sm border border-gray-100 relative">
                            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-5 md:p-6 relative">
                                <p className="text-text-main text-lg leading-relaxed font-medium font-display" contentEditable suppressContentEditableWarning>
                                    "Năm mới đến, chúc Sếp sức khỏe dồi dào, sự nghiệp thăng hoa như Rồng gặp mây. Tiền vào như nước sông Đà, tiền ra nhỏ giọt như cà phê phin. Cảm ơn Sếp đã luôn dẫn dắt team vượt qua mọi sóng gió!"
                                </p>
                                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                                    <span className="text-xs text-gray-400 font-medium">158 ký tự</span>
                                    <div className="flex gap-2">
                                        <button className="size-8 flex items-center justify-center text-gray-500 hover:text-primary rounded-full hover:bg-white transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                        </button>
                                        <button className="size-8 flex items-center justify-center text-gray-500 hover:text-primary rounded-full hover:bg-white transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">share</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default GreetingsScreen;