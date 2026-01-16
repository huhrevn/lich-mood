
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ConverterHeaderProps {
    onReset: () => void;
}

const ConverterHeader: React.FC<ConverterHeaderProps> = ({ onReset }) => {
    const navigate = useNavigate();
    return (
        <header className="sticky top-0 z-50 bg-bg-base/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-transparent dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="size-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 active:bg-gray-200 dark:active:bg-zinc-700 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-zinc-700"
                >
                    <span className="material-symbols-outlined text-gray-600 dark:text-zinc-400">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold text-text-main tracking-tight">Chuyển Đổi Ngày</h1>
            </div>

            <button
                onClick={onReset}
                className="size-10 rounded-full flex items-center justify-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800 text-accent-green hover:text-primary-dark transition-all"
                title="Về hôm nay"
            >
                <span className="material-symbols-outlined text-[22px]">restart_alt</span>
            </button>
        </header>
    );
};

export default React.memo(ConverterHeader);
