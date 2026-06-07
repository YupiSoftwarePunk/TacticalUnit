const API_BASE_URL = "http://localhost:5000/api"; 

export const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        body: options.body,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    }).catch((er)=>{ console.error(er); throw er; } );;

    if (!response.ok) {
        const errorData = await response.json().catch((er)=>{console.error(er); throw er;} );
        throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
};