import React from 'react';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-zinc-900 w-full max-w-md rounded-[24px] shadow-2xl p-6 border border-gray-100 dark:border-zinc-800 animate-[scaleIn_0.2s_ease-out] font-display">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-zinc-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                </button>

                {/* Header */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="size-14 rounded-full bg-purple-50 text-purple-500 dark:bg-purple-900/30 dark:text-purple-400 flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-[32px]">support_agent</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trợ giúp & Hỗ trợ</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Chúng tôi luôn sẵn sàng lắng nghe bạn</p>
                </div>

                {/* Contact Options */}
                <div className="space-y-3 mb-6">
                    <a href="mailto:huhrevn@gmail.com" className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors group">
                        <div className="size-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center shadow-sm text-blue-500">
                            <span className="material-symbols-outlined text-[20px]">mail</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">Gửi Email hỗ trợ</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">huhrevn@gmail.com</p>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 text-[20px]">chevron_right</span>
                    </a>

                    <a href="https://zalo.me/0976317031" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors group">
                        <div className="size-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center shadow-sm text-blue-600">
                            {/* Zalo uses a blue branding, using 'chat' icon as proxy */}
                            <span className="material-symbols-outlined text-[20px]">chat</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">Chat Zalo hỗ trợ</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">0976317031</p>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 text-[20px]">open_in_new</span>
                    </a>
                </div>

                {/* Footer */}
                <div className="text-center pt-2 select-none opacity-50">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500">
                        Xem Lịch 2026 • Version 1.0
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
