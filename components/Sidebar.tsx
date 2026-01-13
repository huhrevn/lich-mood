
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import AddEventModal from './AddEventModal';
import { useLanguage } from '../contexts/LanguageContext';
import { getUserProfile, handleSignoutClick } from '../services/googleCalendarService';

interface UserProfile {
    name: string;
    avatar: string;
}

const Sidebar: React.FC<{ className?: string }> = ({ className = '' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // User State
    const [user, setUser] = useState<UserProfile>({
        name: 'Khách',
        avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
    });

    // Check if we are in a settings sub-route
    const isSettingsRoute = location.pathname.startsWith('/settings');
    const [isSettingsOpen, setIsSettingsOpen] = useState(isSettingsRoute);

    const loadUser = () => {
        getUserProfile().then(p => { if (p) setUser(p); }).catch(() => {});
    };

    useEffect(() => {
        loadUser();
        // Listen for profile updates from Settings screen
        window.addEventListener('user_profile_updated', loadUser);
        return () => window.removeEventListener('user_profile_updated', loadUser);
    }, []);

    // Keep settings open if we navigate to it
    useEffect(() => {
        if (isSettingsRoute) {
            setIsSettingsOpen(true);
        }
    }, [isSettingsRoute]);

    const handleLogout = () => {
        handleSignoutClick();
        window.location.reload(); 
    };

    const isActive = (path: string) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const currentTab = searchParams.get('tab') || 'account';

    // Helper for simple top-level items
    const NavItem = ({ path, icon, label }: { path: string; icon: string; label: string }) => {
        const active = isActive(path);
        return (
            <button
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                    active 
                    ? 'bg-accent-green text-white shadow-glow font-bold' 
                    : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-text-main'
                }`}
            >
                <span className={`material-symbols-outlined text-[22px] transition-transform group-hover:scale-110 ${active ? 'filled-icon' : ''}`}>
                    {icon}
                </span>
                <span className="text-sm font-medium z-10">
                    {label}
                </span>
            </button>
        );
    };

    // Helper for Settings Sub-items
    const SettingsItem = ({ id, label, icon }: { id: string; label: string, icon: string }) => {
        const active = isSettingsRoute && currentTab === id;
        return (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/settings?tab=${id}`);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    active 
                    ? 'bg-accent-green text-white font-bold shadow-sm' 
                    : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-text-main'
                }`}
            >
                {/* Small dot or icon for sub-items */}
                 <span className={`material-symbols-outlined text-[18px] ${active ? 'text-white' : 'text-gray-400'}`}>
                    {icon}
                </span>
                <span>{label}</span>
            </button>
        );
    };

    return (
        <>
            <aside className={`w-64 h-screen sticky top-0 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 flex flex-col py-6 px-4 shadow-sm z-50 ${className}`}>
                {/* Logo Area */}
                <div className="flex items-center gap-3 px-2 mb-8 cursor-pointer group" onClick={() => navigate('/')}>
                    <div className="size-9 bg-accent-green rounded-xl flex items-center justify-center shadow-glow group-hover:rotate-6 transition-transform">
                        <span className="material-symbols-outlined text-white text-xl">calendar_month</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-text-main leading-none">Lịch Mood</h1>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Vạn Niên AI</span>
                    </div>
                </div>

                {/* User Profile Section */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:border-accent-green/30 transition-colors cursor-pointer">
                        <div className="size-10 rounded-full overflow-hidden border border-white dark:border-zinc-700 shadow-sm shrink-0">
                            <img src={user.avatar} className="w-full h-full object-cover" alt="User" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] uppercase tracking-wider text-text-secondary font-semibold">Xin chào</span>
                            <span className="text-sm font-bold text-text-main truncate">{user.name}</span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar pb-4">
                    <NavItem path="/" icon="home" label={t('common.home')} />
                    <NavItem path="/calendar" icon="calendar_month" label={t('common.calendar')} />
                    <NavItem path="/converter" icon="sync_alt" label={t('common.convert')} />
                    <NavItem path="/fortune" icon="spa" label="Xin Xăm" />
                    <NavItem path="/journal" icon="history_edu" label="Nhật Ký" />
                    
                    {/* Settings Group (Collapsible) */}
                    <div className="pt-2">
                        <div className="mb-1">
                            <button
                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group select-none ${
                                    isSettingsRoute 
                                    ? 'bg-gray-50 dark:bg-zinc-800/50 text-text-main font-bold' 
                                    : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-text-main'
                                }`}
                            >
                                <span className={`material-symbols-outlined text-[22px] ${isSettingsRoute ? 'text-accent-green filled-icon' : ''}`}>settings</span>
                                <span className="text-sm font-medium flex-1 text-left">{t('common.settings')}</span>
                                <span className={`material-symbols-outlined text-[20px] text-gray-400 transition-transform duration-300 ${isSettingsOpen ? 'rotate-180' : ''}`}>
                                    expand_more
                                </span>
                            </button>
                        </div>

                        {/* Dropdown Content */}
                        <div 
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                isSettingsOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="pl-3 pr-0 space-y-1 border-l-2 border-gray-100 dark:border-zinc-800 ml-5 my-1">
                                <SettingsItem id="account" label="Tài khoản" icon="person" />
                                <SettingsItem id="notifications" label="Thông báo" icon="notifications" />
                                <SettingsItem id="display" label="Giao diện" icon="palette" />
                                <SettingsItem id="language" label="Ngôn ngữ" icon="translate" />
                                <SettingsItem id="sync" label="Đồng bộ" icon="sync" />
                                <SettingsItem id="security" label="Bảo mật" icon="security" />
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Footer Action Buttons */}
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-3">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-accent-green hover:bg-primary-dark text-white rounded-xl py-3 shadow-glow hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 font-bold"
                    >
                        <span className="material-symbols-outlined text-xl">add</span>
                        <span>Tạo sự kiện</span>
                    </button>

                    {user.name !== 'Khách' && (
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            Đăng xuất
                        </button>
                    )}

                    {/* Standardized Copyright + Version */}
                    <div className="pt-2 text-center select-none">
                        <p className="text-[10px] font-bold text-gray-300 dark:text-zinc-700 uppercase tracking-widest leading-relaxed">
                            © 2026 Lịch Mood v0.1
                        </p>
                    </div>
                </div>
            </aside>

            <AddEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default Sidebar;
