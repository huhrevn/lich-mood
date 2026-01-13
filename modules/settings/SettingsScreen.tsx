
import React from 'react';
import { useSettingsLogic } from './settings.logic';
import { Toggle, SectionMobile, RowMobile, DesktopCard } from './components/SharedComponents';
import ProfileSettings from './components/ProfileSettings';
import SyncSettings from './components/SyncSettings';

const SettingsScreen: React.FC = () => {
    const logic = useSettingsLogic();
    const { t } = logic;

    return (
        <div className="min-h-screen bg-bg-base dark:bg-zinc-950 text-text-main font-display transition-colors">
            {/* --- MOBILE UI --- */}
            <div className="md:hidden pb-32">
                <header className="sticky top-0 z-50 bg-bg-base/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-transparent dark:border-zinc-800 pt-6 pb-3 px-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold tracking-tight">{t('settings.title')}</h1>
                    </div>
                    <button onClick={logic.handleSaveMobile} className="text-accent-green text-xs font-bold uppercase hover:bg-accent-green/10 px-3 py-1.5 rounded-lg transition-all">
                        {t('common.save')}
                    </button>
                </header>

                <main className="p-4 max-w-5xl mx-auto space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                         <SectionMobile title={t('settings.rules')} icon="calendar_apps_script">
                            <RowMobile label={t('settings.timezone')}>
                                <select className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs font-bold py-1.5 px-2 focus:outline-none focus:border-accent-green">
                                    <option>Asia/Ho_Chi_Minh</option>
                                    <option>Asia/Bangkok</option>
                                </select>
                            </RowMobile>
                            <RowMobile label={t('settings.longitude')}>
                                <input disabled value="105°E" className="w-16 text-right bg-transparent text-xs font-bold text-gray-400" />
                            </RowMobile>
                            <RowMobile label={t('settings.leapMonth')}>
                                <Toggle checked={logic.leapMonth} onChange={logic.setLeapMonth} />
                            </RowMobile>
                            <RowMobile label={t('settings.autoConvert')}>
                                <Toggle checked={logic.autoConvert} onChange={logic.setAutoConvert} />
                            </RowMobile>
                        </SectionMobile>
                    </div>

                    <div className="pt-6 pb-2 text-center select-none opacity-50">
                        <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-widest leading-relaxed">
                            © 2026 Lịch Mood v0.1
                        </p>
                        <p className="text-[9px] text-gray-300 dark:text-zinc-700 mt-1">
                            Designed with ❤️ for You
                        </p>
                    </div>
                </main>
            </div>

            {/* --- DESKTOP UI --- */}
            <div className="hidden md:flex min-h-screen bg-bg-base dark:bg-zinc-950 p-2 lg:p-6 w-full">
                <div className="w-full max-w-4xl mx-auto">
                    {logic.notification && (
                        <div className={`fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-[slideUp_0.3s_ease-out] ${
                            logic.notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                            <span className="material-symbols-outlined filled-icon">
                                {logic.notification.type === 'success' ? 'check_circle' : 'error'}
                            </span>
                            <span className="text-sm font-bold">{logic.notification.message}</span>
                        </div>
                    )}
                    
                    <main className="w-full">
                        {logic.activeTab === 'account' && (
                            <ProfileSettings 
                                profile={logic.profile}
                                errors={logic.errors}
                                isLoading={logic.isLoading}
                                isDirty={logic.isDirty}
                                handleAvatarChange={logic.handleAvatarChange}
                                handleInputChange={logic.handleInputChange}
                                saveProfile={logic.saveProfile}
                                startGoogleLogin={logic.startGoogleLogin}
                            />
                        )}

                        {logic.activeTab === 'sync' && (
                            <SyncSettings 
                                syncConfig={logic.syncConfig}
                                setSyncConfig={logic.setSyncConfig}
                                availableCalendars={logic.availableCalendars}
                                isSyncing={logic.isSyncing}
                                connectCalendar={logic.connectCalendar}
                                disconnectCalendar={logic.disconnectCalendar}
                                simulateSync={logic.simulateSync}
                                toggleCalendarSelection={logic.toggleCalendarSelection}
                            />
                        )}

                        {['notifications', 'display', 'language', 'security'].includes(logic.activeTab) && (
                            <div className="animate-[fadeIn_0.3s_ease-out]">
                                <DesktopCard title={
                                    logic.activeTab === 'notifications' ? 'Cài đặt thông báo' : 
                                    logic.activeTab === 'display' ? 'Giao diện ứng dụng' :
                                    logic.activeTab === 'language' ? 'Ngôn ngữ & Khu vực' : 'Bảo mật tài khoản'
                                }>
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                            <span className="material-symbols-outlined text-3xl text-gray-300">construction</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-text-main">Tính năng đang phát triển</h3>
                                        <p className="text-sm text-gray-500 mt-2">Vui lòng quay lại sau.</p>
                                    </div>
                                </DesktopCard>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;
