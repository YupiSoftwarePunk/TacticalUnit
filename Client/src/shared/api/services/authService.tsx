import { apiClient } from "../api";

export const AuthService = {
    getCallBack: () => apiClient<string>("/auth/discord-callback"),
    getDiscordLoginUrl: () => apiClient<string>("/auth/discord-login-url"),
    getCurrentUser: () => apiClient<IUnit>("/auth/me"),
}