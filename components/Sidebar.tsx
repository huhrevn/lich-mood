import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
// import AddEventModal from './AddEventModal'; // Removed: Moved to Global
import { useLanguage } from '../contexts/LanguageContext';

// --- 1. IMPORT AUTH CONTEXT ---
import { useAuth } from '../contexts/AuthContext';
// import { useEvents } from '../contexts/EventContext'; // Removed
// ---------------------------------------------------------

const Sidebar: React.FC<{ className?: string }> = ({ className = '' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useLanguage();
    // const [isModalOpen, setIsModalOpen] = useState(false); // Removed

    // Auth & Event Hooks
    const { user, login, logout } = useAuth();
    // const { openModal } = useEvents(); // Removed
    // ----------------------

    const isSettingsRoute = location.pathname.startsWith('/settings');
    const [isSettingsOpen, setIsSettingsOpen] = useState(isSettingsRoute);

    // Keep settings open if we navigate to it
    useEffect(() => {
        if (isSettingsRoute) {
            setIsSettingsOpen(true);
        }
    }, [isSettingsRoute]);

    const isActive = (path: string) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const currentTab = searchParams.get('tab') || 'account';

    const NavItem = ({ path, icon, label }: { path: string; icon: string; label: string }) => {
        const active = isActive(path);
        return (
            <button
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${active
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

    const SettingsItem = ({ id, label, icon }: { id: string; label: string, icon: string }) => {
        const active = isSettingsRoute && currentTab === id;
        return (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/settings?tab=${id}`);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${active
                    ? 'bg-accent-green text-white font-bold shadow-sm'
                    : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-text-main'
                    }`}
            >
                <span className={`material-symbols-outlined text-[18px] ${active ? 'text-white' : 'text-gray-400'}`}>
                    {icon}
                </span>
                <span>{label}</span>
            </button>
        );
    };

    return (
        <aside className={`w-64 h-screen fixed top-0 left-0 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 flex flex-col py-6 px-4 shadow-sm z-50 ${className}`}>
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



            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-visible pb-4">
                <NavItem path="/" icon="home" label={t('common.home')} />
                <NavItem path="/calendar" icon="calendar_month" label={t('common.calendar')} />
                <NavItem path="/converter" icon="sync_alt" label={t('common.convert')} />
                <NavItem path="/fortune" icon="spa" label="Xin Xăm" />

                <NavItem path="/good-days" icon="event_available" label="Xem Ngày Tốt" />
                <NavItem path="/horoscope" icon="auto_awesome" label="Tử Vi" />
                <NavItem path="/feng-shui" icon="landscape" label="Phong Thủy" />
                <NavItem path="/numerology" icon="numbers" label="Thần Số Học" />
                <NavItem path="/utilities" icon="widgets" label="Tiện Ích Hay" />

                <NavItem path="/settings" icon="settings" label={t('common.settings')} />
            </nav>

            {/* Footer Action Buttons */}
            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-3">
                {/* REMOVED: Create Event Button (Use Double Click on Calendar instead) */}

                {/* --- USER INFO & AUTH ACTIONS --- */}
                {user ? (
                    <div className="flex flex-col gap-2">
                        {/* Profile Card */}
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800">
                            <div className="size-10 rounded-full overflow-hidden border border-white dark:border-zinc-700 shadow-sm shrink-0">
                                <img src={user.avatar || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'} className="w-full h-full object-cover" alt="User" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] uppercase tracking-wider text-text-secondary font-semibold">Xin chào</span>
                                <span className="text-sm font-bold text-text-main truncate">{user.name}</span>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            Đăng xuất
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={login}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 text-text-main rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors shadow-sm"
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            className="w-5 h-5"
                            alt="Google"
                        />
                        <span className="text-sm font-bold">Đăng nhập Google</span>
                    </button>
                )}

                <div className="pt-2 text-center select-none">
                    <p className="text-[10px] font-bold text-gray-300 dark:text-zinc-700 uppercase tracking-widest leading-relaxed">
                        © 2026 Lịch Mood v0.1
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;