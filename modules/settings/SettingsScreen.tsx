
import React from 'react';
import { useSettingsLogic } from './settings.logic';
import { Toggle, SectionMobile, RowMobile, DesktopCard, DesktopContent } from './components/SharedComponents';
import ProfileSettings from './components/ProfileSettings';
import SyncSettings from './components/SyncSettings';

import { useAuth } from '../../contexts/AuthContext'; // Updated import

import { useTheme } from '../../contexts/ThemeContext';

import HelpModal from '../../components/HelpModal';

const SettingsScreen: React.FC = () => {
    const logic = useSettingsLogic();
    const { t } = logic;
    const { user, login, logout, loading } = useAuth(); // Use auth hook
    const { theme, toggleTheme } = useTheme();
    const [isHelpOpen, setIsHelpOpen] = React.useState(false);

    // Helper render item
    const SettingRow = ({ icon, colorClass, title, value, rightType = 'arrow', onToggle }: any) => (
        <div className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
                <div className={`size-10 rounded-full flex items-center justify-center ${colorClass}`}>
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </div>
                <span className="text-base font-bold text-text-main">{title}</span>
            </div>
            <div className="flex items-center gap-2">
                {value && <span className="text-sm font-medium text-gray-500">{value}</span>}
                {rightType === 'arrow' && <span className="material-symbols-outlined text-gray-400 text-[20px]">chevron_right</span>}
                {rightType === 'toggle' && <Toggle checked={!!value} onChange={onToggle} />}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F2F4F8] dark:bg-zinc-950 text-text-main font-display transition-colors">
            <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

            {/* --- MOBILE UI --- */}
            <div className="md:hidden pb-32 px-4 pt-4">
                {/* Profile Card (Ultra Compact) */}
                <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-4 shadow-sm mb-5 flex flex-col items-center text-center relative overflow-hidden transition-colors">
                    {/* Header 'Cài đặt' Inside */}
                    <div className="w-full text-left mb-1">
                        <h1 className="text-lg font-extrabold text-text-main">Cài đặt</h1>
                    </div>

                    {user ? (
                        <div className="w-full flex flex-col items-center animate-[fadeIn_0.3s_ease-out]">
                            <div className="w-full flex items-center gap-3 mb-3 bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-2xl transition-colors">
                                <div className="relative shrink-0">
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="size-12 rounded-full object-cover border-2 border-white dark:border-zinc-700 shadow-sm"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';
                                        }}
                                    />
                                    <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-0.5 border border-white dark:border-zinc-900 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[8px] font-bold">check</span>
                                    </div>
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <h2 className="text-sm font-bold text-text-main flex items-center gap-1">
                                        {user.name}
                                        <span className="material-symbols-outlined text-blue-500 text-[14px] filled-icon">verified</span>
                                    </h2>
                                    <p className="text-[10px] text-gray-500 dark:text-zinc-400 font-medium truncate">{user.email || 'Google Account'}</p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="shrink-0 bg-white dark:bg-zinc-800 border border-transparent dark:border-zinc-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 p-2 rounded-xl transition-all shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center animate-[fadeIn_0.3s_ease-out]">
                            {/* Avatar & Text Group - Stacked but tighter */}
                            <div className="size-12 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-1 text-gray-300 dark:text-zinc-600 transition-colors">
                                <span className="material-symbols-outlined text-2xl">person</span>
                            </div>
                            <h2 className="text-base font-bold text-text-main mb-0.5">Chưa đăng nhập</h2>
                            <p className="text-[11px] text-gray-400 dark:text-zinc-500 font-medium mb-3">Kết nối để đồng bộ lịch</p>

                            <button
                                onClick={login}
                                disabled={loading}
                                className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm text-text-main dark:text-zinc-200 font-bold text-sm py-2 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 group hover:border-gray-300 dark:hover:border-zinc-600"
                            >
                                {loading ? (
                                    <span className="size-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4 group-hover:scale-110 transition-transform" alt="G" />
                                )}
                                Kết nối Google
                            </button>
                        </div>
                    )}
                </div>

                {/* Settings Group: CÀI ĐẶT CHUNG */}
                <div className="mb-2">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 pl-2 opacity-80">Tiện ích</h3>
                    <div className="bg-white dark:bg-zinc-900 rounded-[20px] overflow-hidden shadow-sm divide-y divide-gray-100 dark:divide-zinc-800">
                        {/* Dark Mode */}
                        <div className="flex items-center justify-between p-4 px-5">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    <span className="material-symbols-outlined text-[20px] filled-icon">dark_mode</span>
                                </div>
                                <span className="text-base font-bold text-text-main">Giao diện tối</span>
                            </div>
                            <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
                        </div>



                        {/* Help */}
                        <div
                            onClick={() => setIsHelpOpen(true)}
                            className="flex items-center justify-between p-4 px-5 active:bg-gray-50 dark:active:bg-zinc-800 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full flex items-center justify-center bg-purple-50 text-purple-500 dark:bg-purple-900/30 dark:text-purple-400">
                                    <span className="material-symbols-outlined text-[20px]">help</span>
                                </div>
                                <span className="text-base font-bold text-text-main">Trợ giúp & Hỗ trợ</span>
                            </div>
                            <span className="material-symbols-outlined text-gray-400 text-[20px]">chevron_right</span>
                        </div>
                    </div>
                </div>

                <div className="pt-1 pb-4 text-center select-none opacity-50">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-600">Xem Lịch 2026 • Version 1.0</p>
                    <div className="flex items-center justify-center gap-4 mt-3">
                        <span className="material-symbols-outlined text-gray-300 text-[18px]">security</span>
                        <span className="material-symbols-outlined text-gray-300 text-[18px]">public</span>
                    </div>
                </div>
            </div>

            {/* --- DESKTOP UI --- */}
            <div className="hidden md:flex min-h-screen bg-bg-base dark:bg-zinc-950 p-4 lg:p-8 w-full">
                <div className="w-full max-w-6xl mx-auto">
                    {/* Main Settings Card */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-gray-100 dark:border-zinc-800 flex overflow-hidden min-h-[600px]">

                        {/* Sidebar */}
                        <aside className="w-64 shrink-0 flex flex-col gap-2 p-6 border-r border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-900/50">
                            <h1 className="text-2xl font-black text-text-main mb-6 px-2">Cài đặt</h1>

                            {[
                                { id: 'account', label: 'Tài khoản', icon: 'person' },
                                { id: 'notifications', label: 'Thông báo', icon: 'notifications' },
                                { id: 'display', label: 'Giao diện', icon: 'palette' },
                                { id: 'language', label: 'Ngôn ngữ', icon: 'translate' },
                                { id: 'sync', label: 'Đồng bộ', icon: 'sync' },
                                { id: 'security', label: 'Bảo mật', icon: 'security' },
                            ].map((cat) => {
                                const active = logic.activeTab === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => logic.navigateToTab(cat.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
                                            ? 'bg-white dark:bg-zinc-800 text-accent-green shadow-sm font-bold'
                                            : 'text-text-secondary hover:bg-white dark:hover:bg-zinc-800 hover:text-text-main'
                                            }`}
                                    >
                                        <span className={`material-symbols-outlined text-[20px] ${active ? 'filled-icon' : 'text-gray-400 group-hover:text-accent-green'}`}>
                                            {cat.icon}
                                        </span>
                                        <span className="text-sm font-medium">{cat.label}</span>
                                        {active && (
                                            <span className="material-symbols-outlined text-[18px] ml-auto">chevron_right</span>
                                        )}
                                    </button>
                                );
                            })}
                        </aside>

                        {/* Content Area */}
                        <main className="flex-1 min-w-0 p-8">
                            {logic.notification && (
                                <div className={`mb-6 p-4 rounded-2xl shadow-sm flex items-center gap-3 animate-[slideDown_0.3s_ease-out] ${logic.notification.type === 'success'
                                    ? 'bg-green-50 text-green-800 border border-green-100'
                                    : 'bg-red-50 text-red-800 border border-red-100'
                                    }`}>
                                    <span className="material-symbols-outlined filled-icon">
                                        {logic.notification.type === 'success' ? 'check_circle' : 'error'}
                                    </span>
                                    <span className="text-sm font-bold">{logic.notification.message}</span>
                                </div>
                            )}

                            <div className="animate-[slideUp_0.3s_ease-out] h-full">
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
                                    <DesktopContent title={
                                        logic.activeTab === 'notifications' ? 'Cài đặt thông báo' :
                                            logic.activeTab === 'display' ? 'Giao diện ứng dụng' :
                                                logic.activeTab === 'language' ? 'Ngôn ngữ & Khu vực' : 'Bảo mật tài khoản'
                                    }>
                                        <div className="flex flex-col items-center justify-center py-20 text-center h-full">
                                            <div className="size-24 bg-gray-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
                                                <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-zinc-700">construction</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-text-main">Sắp ra mắt</h3>
                                            <p className="text-base text-gray-500 mt-2 max-w-sm mx-auto">Tính năng này đang được phát triển và sẽ sớm ra mắt trong bản cập nhật tới.</p>
                                        </div>
                                    </DesktopContent>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;
