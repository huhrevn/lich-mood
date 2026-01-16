
import React from 'react';

export const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
    <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-green/20 ${checked ? 'bg-accent-green' : 'bg-gray-200 dark:bg-zinc-700'
            }`}
    >
        <div
            className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'
                }`}
        />
    </button>
);

export const DesktopCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-gray-100 dark:border-zinc-800 p-8 mb-6 animate-[fadeIn_0.3s_ease-out]">
        <h2 className="text-xl font-bold text-text-main mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4 flex items-center gap-2">
            {title}
        </h2>
        {children}
    </div>
);

export const DesktopContent: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="animate-[fadeIn_0.3s_ease-out] h-full">
        <h2 className="text-2xl font-bold text-text-main mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-2">
            {title}
        </h2>
        {children}
    </div>
);

export const SectionMobile: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-bg-surface dark:bg-zinc-900 rounded-xl shadow-card dark:shadow-none border border-gray-100 dark:border-zinc-800 overflow-hidden h-full">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-accent-green text-lg">{icon}</span>
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wide">{title}</h3>
        </div>
        <div className="p-4 space-y-4">
            {children}
        </div>
    </div>
);

export const RowMobile: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-text-secondary">{label}</span>
        <div className="flex-1 max-w-[200px] flex justify-end">
            {children}
        </div>
    </div>
);
