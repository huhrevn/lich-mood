
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { TRANSLATIONS, Language } from '../constants/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('vi');

    useEffect(() => {
        // Init from local storage or app settings
        const storedSettings = localStorage.getItem('app_settings');
        if (storedSettings) {
            try {
                const parsed = JSON.parse(storedSettings);
                // Check if 'lang' is 'Tiếng Việt' or 'English' from old code, map to 'vi'/'en'
                if (parsed.lang === 'English' || parsed.lang === 'en') {
                    setLanguageState('en');
                } else {
                    setLanguageState('vi');
                }
            } catch (e) {
                console.error("Failed to parse language setting");
            }
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        // Also update the big settings object in local storage to keep sync
        const storedSettings = localStorage.getItem('app_settings');
        let settings = {};
        if (storedSettings) {
             try { settings = JSON.parse(storedSettings); } catch(e){}
        }
        const langLabel = lang === 'en' ? 'English' : 'Tiếng Việt';
        localStorage.setItem('app_settings', JSON.stringify({ ...settings, lang: langLabel }));
    };

    // Helper to access nested keys string "home.greeting"
    const t = (path: string): string => {
        const keys = path.split('.');
        let current: any = TRANSLATIONS[language];
        
        for (const key of keys) {
            if (current[key] === undefined) {
                console.warn(`Missing translation for key: ${path} in language: ${language}`);
                return path;
            }
            current = current[key];
        }
        return current as string;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
