
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { initializeGapiClient, initializeGisClient } from '../services/googleCalendarService';
import { useLanguage } from '../contexts/LanguageContext';
import { useEvents } from '../contexts/EventContext';

interface BottomNavProps {
  className?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { openModal } = useEvents();

  const isActive = (path: string) => location.pathname === path;

  // Init Google Scripts on Mount
  useEffect(() => {
    initializeGapiClient().catch(console.error);
    initializeGisClient().catch(console.error);
  }, []);

  const handleAddClick = () => {
    openModal();
  };

  const NavItem = ({ path, icon, label }: { path: string; icon: string; label: string }) => {
    const active = isActive(path);
    return (
      <button
        onClick={() => navigate(path)}
        className="flex flex-col items-center gap-1 group w-14 pb-1"
      >
        <span
          className={`material-symbols-outlined text-[26px] transition-all duration-300 ${active ? 'text-accent-green filled-icon' : 'text-gray-400 dark:text-zinc-500 group-hover:text-accent-green'
            }`}
        >
          {icon}
        </span>
        <span className={`text-[10px] font-medium leading-none transition-colors ${active ? 'text-text-main font-bold' : 'text-gray-500 dark:text-zinc-500 group-hover:text-text-main'}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className={`md:hidden ${className}`}>
      {/* Gradient fade overlay above nav */}
      <div className="fixed bottom-0 left-0 w-full z-40 pointer-events-none h-24 bg-gradient-to-t from-bg-base/80 to-transparent"></div>

      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-t border-gray-200/60 dark:border-zinc-800 pb-8 pt-3 px-6 flex justify-between items-end shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">

        <NavItem path="/" icon="home" label={t('common.home')} />

        <NavItem path="/calendar" icon="calendar_month" label={t('common.calendar')} />

        {/* Center Button */}
        <div className="relative -top-5">
          <button
            onClick={handleAddClick}
            className="size-14 rounded-full bg-accent-green flex items-center justify-center text-white shadow-glow hover:scale-105 active:scale-95 transition-all ring-4 ring-bg-base dark:ring-zinc-950"
          >
            <span className="material-symbols-outlined text-[28px]">add</span>
          </button>
        </div>

        <NavItem path="/converter" icon="sync_alt" label={t('common.convert')} />

        <NavItem path="/settings" icon="settings" label={t('common.settings')} />

      </nav>
    </div>
  );
};

export default BottomNav;
