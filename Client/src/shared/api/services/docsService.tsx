import { apiClient } from "../api";


export const DocService = {
    getAll: () => apiClient<IDoc[]>("/doc"),
    createNew: (options: RequestInit) => apiClient<IUploadDoc>("/doc", { method: "POST", ...options }),

    getById: (docId: string) => apiClient<IDoc>(`/doc/${docId}`),
    delete: (docId: string) => apiClient<void>(`/doc/${docId}`, { method: "DELETE" })
};