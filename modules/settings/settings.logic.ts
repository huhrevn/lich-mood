import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { handleAuthClick, getUserProfile, fetchMockCalendars } from '../../services/googleCalendarService';

export interface AppProfile {
    isLoggedIn: boolean;
    name: string;
    displayName: string;
    email: string;
    avatar: string;
    phone: string;
    bio: string;
}

export interface SyncConfig {
    isConnected: boolean;
    scopes: 'readonly' | 'events';
    selectedCalendars: string[];
    direction: 'import' | 'export' | 'bidirectional';
    conflictPolicy: 'app' | 'google' | 'ask';
    timezone: string;
    lastSyncAt: string | null;
}

export const useSettingsLogic = () => {
    const { t, language, setLanguage } = useLanguage();
    const [searchParams] = useSearchParams();
    
    // --- SHARED STATE ---
    const [leapMonth, setLeapMonth] = useState(true);
    const [autoConvert, setAutoConvert] = useState(true);
    const [displayOptions, setDisplayOptions] = useState({
        canChi: true,
        nguHanh: false,
        gioTot: true,
        tuoiXung: false
    });

    // --- DESKTOP STATE ---
    const activeTab = searchParams.get('tab') || 'account';
    
    // Profile State
    const [profile, setProfile] = useState<AppProfile>({
        isLoggedIn: false,
        name: 'Admin User',
        displayName: 'Admin',
        email: 'admin@lichmood.vn',
        avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=4A7B4F&color=fff',
        phone: '+84 90 123 4567',
        bio: 'Người đam mê công nghệ và yêu thích sự tối giản.'
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isDirty, setIsDirty] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Sync State
    const [syncConfig, setSyncConfig] = useState<SyncConfig>({
        isConnected: false,
        scopes: 'events',
        selectedCalendars: ['primary'],
        direction: 'bidirectional',
        conflictPolicy: 'app',
        timezone: 'Asia/Ho_Chi_Minh',
        lastSyncAt: null
    });
    const [availableCalendars, setAvailableCalendars] = useState<Array<{id: string, summary: string, color: string}>>([]);
    const [isSyncing, setIsSyncing] = useState(false);

    // --- EFFECTS ---
    useEffect(() => {
        const storedProfile = localStorage.getItem('app_profile');
        if (storedProfile) {
            try {
                const parsed = JSON.parse(storedProfile);
                setProfile(prev => ({
                    ...prev,
                    ...parsed,
                    displayName: parsed.displayName || parsed.name.split(' ')[0]
                }));
            } catch (e) {}
        }

        if (localStorage.getItem('app_sync_config')) {
             setSyncConfig(JSON.parse(localStorage.getItem('app_sync_config')!));
        }
    }, []);

    // --- HANDLERS ---
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            setNotification({ type: 'error', message: 'Chỉ chấp nhận file ảnh JPG, PNG, GIF.' });
            return;
        }
        if (file.size > 2 * 1024 * 1024) { 
             setNotification({ type: 'error', message: 'Dung lượng ảnh tối đa 2MB.' });
             return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setProfile(prev => ({ ...prev, avatar: base64 }));
            setIsDirty(true);
        };
        reader.readAsDataURL(file);
    };

    const handleInputChange = (field: keyof AppProfile, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
        
        const newErrors = { ...errors };
        if (field === 'phone') {
            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(value)) {
                newErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)';
            } else {
                delete newErrors.phone;
            }
        }
        if (field === 'name' && value.length < 2) {
            newErrors.name = 'Họ tên quá ngắn';
        } else if (field === 'name') {
            delete newErrors.name;
        }
        setErrors(newErrors);
    };

    const saveProfile = () => {
        if (Object.keys(errors).length > 0) {
             setNotification({ type: 'error', message: 'Vui lòng sửa các lỗi trước khi lưu.' });
             return;
        }

        setIsLoading(true);
        setNotification(null);

        setTimeout(() => {
            setIsLoading(false);
            localStorage.setItem('app_profile', JSON.stringify(profile));
            window.dispatchEvent(new Event('user_profile_updated'));
            setIsDirty(false);
            setNotification({ type: 'success', message: 'Cập nhật hồ sơ thành công!' });
            setTimeout(() => setNotification(null), 3000);
        }, 800);
    };

    const startGoogleLogin = async () => {
        try {
            await handleAuthClick();
            const gProfile = await getUserProfile();
            if (gProfile) {
                const newProfile = {
                    ...profile,
                    isLoggedIn: true,
                    name: gProfile.name,
                    email: gProfile.email || profile.email,
                    avatar: gProfile.avatar
                };
                setProfile(newProfile);
                localStorage.setItem('app_profile', JSON.stringify(newProfile));
                window.dispatchEvent(new Event('user_profile_updated'));
            }
        } catch (e) {
            console.error("Login failed", e);
        }
    };

    const connectCalendar = async () => {
        const cals = await fetchMockCalendars();
        setAvailableCalendars(cals);
        setSyncConfig(prev => ({ ...prev, isConnected: true }));
        localStorage.setItem('app_sync_config', JSON.stringify({ ...syncConfig, isConnected: true }));
    };

    const disconnectCalendar = () => {
        setSyncConfig(prev => ({ ...prev, isConnected: false }));
        localStorage.setItem('app_sync_config', JSON.stringify({ ...syncConfig, isConnected: false }));
    };

    const simulateSync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            const now = new Date().toLocaleString('vi-VN');
            const newConfig = { ...syncConfig, lastSyncAt: now };
            setSyncConfig(newConfig);
            localStorage.setItem('app_sync_config', JSON.stringify(newConfig));
            alert("Đồng bộ thành công!");
        }, 2000);
    };

    const toggleCalendarSelection = (id: string) => {
        setSyncConfig(prev => {
            const selected = prev.selectedCalendars.includes(id)
                ? prev.selectedCalendars.filter(c => c !== id)
                : [...prev.selectedCalendars, id];
            return { ...prev, selectedCalendars: selected };
        });
    };

    const handleSaveMobile = () => { saveProfile(); };

    return {
        t,
        activeTab,
        // Profile
        profile,
        isLoading,
        errors,
        isDirty,
        notification,
        handleAvatarChange,
        handleInputChange,
        saveProfile,
        startGoogleLogin,
        // Sync
        syncConfig,
        setSyncConfig,
        availableCalendars,
        isSyncing,
        connectCalendar,
        disconnectCalendar,
        simulateSync,
        toggleCalendarSelection,
        // Mobile Logic
        leapMonth, setLeapMonth,
        autoConvert, setAutoConvert,
        displayOptions, setDisplayOptions,
        handleSaveMobile
    };
};