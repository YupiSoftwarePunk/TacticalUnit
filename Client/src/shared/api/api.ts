const API_BASE_URL = "http://localhost:6061/api"; 

export const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const method = (options.method || "GET").toUpperCase();

    let token = null;
    if (typeof window !== "undefined") {
        token = localStorage.getItem("access_token");
    }

    const headers = new Headers(options.headers);

    if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const requiresAuth = method !== "GET" || endpoint.startsWith("/auth/me");

    if (token && requiresAuth) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
};