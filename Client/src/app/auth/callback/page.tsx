"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/shared/api/services/authService";
import { useAuth } from "@/context/AuthContext";

function AuthCallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { checkAuth } = useAuth();
    const hasCalledApi = useRef(false); 

    useEffect(() => {
        const code = searchParams?.get("code");
        const state = searchParams?.get("state");

        if (!code) {
            console.warn("Параметр 'code' отсутствует в URL, пропускаем авторизацию.");
            return;
        }

        if (hasCalledApi.current) return;
        hasCalledApi.current = true;

        const processAuthentication = async () => {
            try {
                console.log("Отправка кода авторизации на бэкенд...", code);
                const response = await AuthService.getCallBack(code, state || undefined);

                if (response && response.access_token) {
                    console.log("Токен успешно получен! Сохраняем в localStorage...");
                    localStorage.setItem("access_token", response.access_token);
                    console.log("Запрос данных текущего пользователя...");
                    await checkAuth();

                    console.log("Авторизация завершена. Перенаправление на /profile...");
                    router.push("/profile");
                } 
                else {
                    console.error("Бэкенд вернул успешный статус, но поле access_token отсутствует в ответе.");
                    router.push("/?error=token_missing");
                }
            } 
            catch (error) {
                console.error("Ошибка при выполнении коллбэка авторизации:", error);
                router.push("/?error=auth_failed");
            }
        };

        processAuthentication();
    }, [router, searchParams, checkAuth]); 

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary text-text-primary font-text">
            <div className="text-3xl mb-4 animate-bounce">🛡️</div>
            <h1 className="text-xl font-text-bold uppercase tracking-wider">Синхронизация с Discord...</h1>
            <p className="text-text-secondary text-sm mt-2">Пожалуйста, подождите, мы проверяем ваши данные.</p>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary text-text-primary font-text">
                <div className="text-3xl mb-4 animate-bounce">🛡️</div>
                <h1 className="text-xl font-text-bold uppercase tracking-wider">Синхронизация с Discord...</h1>
                <p className="text-text-secondary text-sm mt-2">Загрузка интерфейса...</p>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}