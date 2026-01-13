
import React from 'react';
import { WeatherData, LocationData, SearchResult } from '../../types/homeTypes';
import { useLanguage } from '../../contexts/LanguageContext';

interface WeatherCardProps {
    weather: WeatherData;
    currentLocation: LocationData;
    loadingWeather: boolean;
    isSearchOpen: boolean;
    searchQuery: string;
    isSearching: boolean;
    searchResults: SearchResult[];
    currentTime: Date;
    onSearchOpen: (open: boolean) => void;
    onSearchQueryChange: (query: string) => void;
    onSelectLocation: (loc: SearchResult) => void;
    onClearSearch: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
    weather, currentLocation, loadingWeather,
    isSearchOpen, searchQuery, isSearching, searchResults, currentTime,
    onSearchOpen, onSearchQueryChange, onSelectLocation, onClearSearch
}) => {
    const { t } = useLanguage();
    
    const weatherInfo = (code: number) => {
        if (code === 0) return { icon: 'sunny', label: t('weather.sunny') };
        if (code <= 3) return { icon: 'partly_cloudy_day', label: t('weather.cloudy') };
        if (code <= 48) return { icon: 'foggy', label: t('weather.fog') };
        if (code <= 67) return { icon: 'rainy', label: t('weather.rain') };
        if (code <= 99) return { icon: 'thunderstorm', label: t('weather.storm') };
        return { icon: 'cloud', label: t('weather.overcast') };
    };
    const wInfo = weatherInfo(weather.weatherCode);
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');

    return (
        <div className="bg-bg-surface dark:bg-zinc-900 rounded-[24px] shadow-card dark:shadow-none border border-white dark:border-zinc-800 p-4 relative overflow-visible group animate-[slideUp_0.4s_ease-out]">
            {/* Background Blobs */}
            <div className="absolute inset-0 overflow-hidden rounded-[24px] z-0 pointer-events-none">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-[40px] opacity-60"></div>
                    <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-accent-green/10 dark:bg-accent-green/5 rounded-full blur-[40px] opacity-60"></div>
            </div>
            
            <div className="relative z-10">
                {/* Search / Location Header */}
                <div className="flex items-start justify-between mb-2 h-9 relative z-50">
                    {isSearchOpen ? (
                        <div className="flex-1 flex items-center gap-2 animate-[fadeIn_0.2s_ease-out]">
                            <div className="relative flex-1">
                                <input 
                                    autoFocus
                                    type="text" 
                                    placeholder={t('common.search')}
                                    className="w-full bg-white dark:bg-zinc-800 border-2 border-blue-500 rounded-full py-1.5 pl-4 pr-10 text-sm focus:outline-none shadow-sm text-text-main placeholder-gray-400 dark:placeholder-zinc-500"
                                    value={searchQuery}
                                    onChange={(e) => onSearchQueryChange(e.target.value)}
                                />
                                {isSearching ? (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 size-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                ) : searchQuery && (
                                    <button 
                                        onClick={onClearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">close</span>
                                    </button>
                                )}
                                
                                {searchResults.length > 0 && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-700 overflow-hidden z-50 max-h-[200px] overflow-y-auto">
                                        {searchResults.map((result) => (
                                            <button 
                                                key={result.id}
                                                onClick={() => onSelectLocation(result)}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-700 text-sm border-b border-gray-50 dark:border-zinc-700 last:border-0 flex flex-col transition-colors group"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-text-main group-hover:text-blue-600 transition-colors">
                                                        {result.name}
                                                    </span>
                                                    {result.feature_code === 'ADM1' && (
                                                        <span className="text-[9px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-800 font-bold uppercase">{t('weather.province')}</span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 truncate">
                                                    {[result.admin1, result.country].filter(Boolean).join(', ')}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={() => onSearchOpen(false)}
                                className="text-sm font-semibold text-gray-500 dark:text-zinc-400 hover:text-text-main px-1 whitespace-nowrap"
                            >
                                {t('common.cancel')}
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col animate-[fadeIn_0.2s_ease-out]">
                                <div className="flex items-center gap-1.5 text-accent-green mb-0.5 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onSearchOpen(true)}>
                                    <span className="material-symbols-outlined text-[18px] fill-current">location_on</span>
                                    <h3 className="text-sm font-bold text-text-main truncate max-w-[200px]">{currentLocation.name}, {currentLocation.country}</h3>
                                    <span className="material-symbols-outlined text-[16px] text-gray-400">expand_more</span>
                                </div>
                                <span className="text-[10px] font-medium text-text-secondary pl-6 flex items-center gap-1">
                                    {loadingWeather && <span className="size-2 bg-accent-green rounded-full animate-ping"></span>}
                                    {t('weather.updated_at')} {hours}:{minutes}
                                </span>
                            </div>
                            <button 
                                onClick={() => onSearchOpen(true)}
                                className="size-8 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-text-secondary hover:bg-accent-green hover:text-white transition-all shadow-sm"
                            >
                                <span className="material-symbols-outlined text-[18px]">search</span>
                            </button>
                        </>
                    )}
                </div>

                {/* Main Weather */}
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-[2.75rem] sm:text-[3.5rem] leading-none font-bold text-accent-green tracking-tighter tabular-nums">
                            {weather.temp}°
                        </span>
                        <div className="flex flex-col justify-center">
                            <span className="text-sm sm:text-base font-bold text-text-main capitalize">{wInfo.label}</span>
                            <span className="text-xs font-medium text-text-secondary">{t('weather.feels_like')} {weather.feelsLike}°</span>
                        </div>
                    </div>
                    <div className="relative">
                        <span className="material-symbols-outlined text-[40px] sm:text-[48px] text-accent-green drop-shadow-sm filled-icon animate-[float_4s_ease-in-out_infinite]">
                            {wInfo.icon}
                        </span>
                    </div>
                </div>

                {/* Bottom Metrics */}
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-1.5 bg-gray-50/80 dark:bg-zinc-800/80 px-2.5 py-1.5 rounded-lg border border-gray-100/50 dark:border-zinc-700/50 shrink-0">
                        <span className="material-symbols-outlined text-accent-green text-[16px]">air</span>
                        <div className="flex flex-col">
                            <span className="text-[8px] sm:text-[9px] font-bold text-accent-green uppercase tracking-wide">{t('weather.wind')}</span>
                            <span className="text-[11px] sm:text-xs font-semibold text-text-main">{weather.windSpeed} km/h</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50/80 dark:bg-zinc-800/80 px-2.5 py-1.5 rounded-lg border border-gray-100/50 dark:border-zinc-700/50 shrink-0">
                        <span className="material-symbols-outlined text-accent-green text-[16px]">water_drop</span>
                        <div className="flex flex-col">
                            <span className="text-[8px] sm:text-[9px] font-bold text-accent-green uppercase tracking-wide">{t('weather.humidity')}</span>
                            <span className="text-[11px] sm:text-xs font-semibold text-text-main">{weather.humidity}%</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50/80 dark:bg-zinc-800/80 px-2.5 py-1.5 rounded-lg border border-gray-100/50 dark:border-zinc-700/50 shrink-0">
                        <span className="material-symbols-outlined text-accent-green text-[16px]">visibility</span>
                        <div className="flex flex-col">
                            <span className="text-[8px] sm:text-[9px] font-bold text-accent-green uppercase tracking-wide">{t('weather.visibility')}</span>
                            <span className="text-[11px] sm:text-xs font-semibold text-text-main">{weather.visibility} km</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(WeatherCard);
