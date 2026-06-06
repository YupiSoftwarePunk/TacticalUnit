"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/shared/api/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function AuthCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { checkAuth } = useAuth();
    const lock = useRef(false);

    useEffect(() => {
        if (searchParams == null) {
            console.error("Отсутствуют параметры запроса");
            return;
        }
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (!code || lock.current) return;

        const processAuthentication = async () => {
            lock.current = true;
            try {
                const response = await AuthService.getCallBack(code, state || undefined);

                if (response && response.access_token) {
                    localStorage.setItem("access_token", response.access_token);
                    await checkAuth();
                    router.push("/profile");
                } 
                else {
                    console.error("Бэкенд не вернул токен доступа");
                    router.push("/?error=token_missing");
                }
            } 
            catch (error) {
                console.error("Ошибка при выполнении коллбэка авторизации:", error);
                router.push("/?error=auth_failed");
            }
        };

        processAuthentication();
    }, [searchParams, router, checkAuth]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary text-text-primary font-text">
            <div className="text-3xl mb-4 animate-bounce">🛡️</div>
            <h1 className="text-xl font-text-bold uppercase tracking-wider">Синхронизация с Discord...</h1>
            <p className="text-text-secondary text-sm mt-2">Пожалуйста, подождите, мы проверяем ваши данные.</p>
        </div>
    );
}