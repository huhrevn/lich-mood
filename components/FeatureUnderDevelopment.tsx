import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const FeatureUnderDevelopment: React.FC<{ title: string }> = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="size-24 rounded-full bg-gray-50 dark:bg-zinc-800/50 flex items-center justify-center mb-6 shadow-sm">
                <span className="material-symbols-outlined text-[40px] text-gray-400 dark:text-zinc-500">
                    construction
                </span>
            </div>
            <h2 className="text-2xl font-bold text-text-main mb-2">{title}</h2>
            <p className="text-text-secondary max-w-md">
                Tính năng này đang được phát triển. Chúng tôi sẽ sớm cập nhật trong thời gian tới!
            </p>
        </div>
    );
};

export default FeatureUnderDevelopment;
