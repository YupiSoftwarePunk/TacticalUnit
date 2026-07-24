import { apiClient } from "../api";


export const DocService = {
    getAll: () => apiClient<IDoc[]>("/doc"),
    createNew: (options: RequestInit) => apiClient<IDoc[]>("/doc", options),

    getById: (docId: number) => apiClient<IDoc>(`/doc/${docId}`),
    delete: (docId: number) => apiClient<void>(`/doc/${docId}`)
};