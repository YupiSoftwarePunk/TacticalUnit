const API_BASE_URL = "http://localhost:5000/api"; 

export const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const method = (options.method || "GET").toUpperCase();

    let token = null;
    if (typeof window !== "undefined") {
        token = localStorage.getItem("access_token");
    }

    const headersInit: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (options.headers) {
        const customHeaders = new Headers(options.headers);
        customHeaders.forEach((value, key) => {
            headersInit[key] = value;
        });
    }

    const requiresAuth = method !== "GET" || endpoint.startsWith("/auth/me");

    if (token && requiresAuth) {
        headersInit["Authorization"] = `Bearer ${token}`;
    }

    const { headers: _, ...restOptions } = options;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...restOptions,
        method,
        headers: headersInit,
    }).catch((er) => { 
        console.error(er); 
        throw er; 
    });

    if (!response.ok) {
        let errorMessage = `API Error: ${response.status}`;
        try {
            const textData = await response.text();
            try {
                const errorData = JSON.parse(textData);
                errorMessage = errorData.error || errorData.message || errorMessage;
            } 
            catch {
                if (textData && textData.trim()) {
                    errorMessage = textData;
                }
            }
        } 
        catch (e) {
            console.error("Не удалось прочитать тело ответа об ошибке:", e);
        }
        throw new Error(errorMessage);
    }

    return response.json();
};