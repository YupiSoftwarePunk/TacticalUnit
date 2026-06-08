"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { AuthService } from "@/shared/api/services/authService";

interface AuthContextType {
    user: ICurrentUserResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<ICurrentUserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isProcessed = useRef(false);

    const checkAuth = async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        
        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const userData = await AuthService.getCurrentUser();
            setUser(userData);
        } 
        catch (error) {
            console.error("Ошибка верификации сессии пользователя:", error);
            logout();
        } 
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isProcessed.current) return;
        isProcessed.current = true;

    const handleDiscordCallback = async () => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");
            const state = urlParams.get("state");

            if (code) {
                setIsLoading(true);
                try {
                    const data = await AuthService.getCallBack(code, state || undefined);
                    
                    if (data && data.access_token) {
                        localStorage.setItem("access_token", data.access_token);
                        window.history.replaceState({}, document.title, window.location.pathname);
                    }
                } 
                catch (error) {
                    console.error("Ошибка при обработке ответа Discord OAuth:", error);
                } 
                finally {
                    setIsLoading(false);
                }
            }
        }

        await checkAuth();
    };

    handleDiscordCallback();
}, []);

    const login = async () => {
        try {
            const data = await AuthService.getDiscordLoginUrl();
            if (data && data.login_url) {
                window.location.href = data.login_url;
            }
        } 
        catch (error) {
            console.error("Не удалось сгенерировать ссылку авторизации Discord:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        setUser(null);
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth должен использоваться внутри AuthProvider");
    }
    return context;
};