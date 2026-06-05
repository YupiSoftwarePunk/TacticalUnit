import { apiClient } from "../api";

export const AuthService = {
    getCallBack: (code: string, state?: string) => {
        const params = new URLSearchParams();
        params.append("code", code);
        if (state) params.append("state", state);
        
        return apiClient<IDiscordCallbackResponse>(`/auth/discord-callback?${params.toString()}`);
    },
    getDiscordLoginUrl: () => apiClient<IDiscordLoginUrlResponse>("/auth/discord-login-url"),
    getCurrentUser: () => apiClient<ICurrentUserResponse>("/auth/me"),
}