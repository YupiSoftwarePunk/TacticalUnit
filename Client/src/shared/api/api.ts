const API_BASE_URL = "http://localhost:5000/api"; 

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
        body: options.body,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    }).catch((er)=>{ console.error(er); throw er; } );;

    if (!response.ok) {
        let errorMessage = `API Error: ${response.status}`;
        
        try {
            const textData = await response.text();
            
            try {
                const errorData = JSON.parse(textData);
                errorMessage = errorData.message || errorData.error || errorMessage;
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