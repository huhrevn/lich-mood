import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    handleAuthClick,
    handleSignoutClick,
    getUserProfile,
    initializeGapiClient,
    initializeGisClient
} from '../services/googleCalendarService';

export interface UserProfile {
    name: string;
    avatar: string;
    email?: string;
}

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false,
    login: async () => { },
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);

    // 1. Init Google Services on Mount & Check Persistence
    useEffect(() => {
        const init = async () => {
            await initializeGapiClient();
            await initializeGisClient();

            const p = await getUserProfile();
            if (p) setUser(p);
        };
        init();

        // Listen for profile updates (global event fallback)
        const handleProfileUpdate = async () => {
            const p = await getUserProfile();
            setUser(p);
        };
        window.addEventListener('user_profile_updated', handleProfileUpdate);
        return () => window.removeEventListener('user_profile_updated', handleProfileUpdate);
    }, []);

    const login = async () => {
        setLoading(true);
        try {
            await handleAuthClick();
            const p = await getUserProfile();
            if (p) {
                setUser(p);
                // Trigger global event for other non-context components if any
                window.dispatchEvent(new Event('user_profile_updated'));
            }
        } catch (error) {
            console.error("Login failed", error);
        }
        setLoading(false);
    };

    const logout = () => {
        handleSignoutClick();
        setUser(null);
        window.dispatchEvent(new Event('user_profile_updated'));
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
