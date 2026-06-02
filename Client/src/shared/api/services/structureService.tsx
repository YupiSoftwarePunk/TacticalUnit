import { apiClient } from "../api";


export const StructureService = {
    get: () => apiClient<JSON>("/structure"),
};