import { apiClient } from "../api";


export const StructureService = {
    get: () => apiClient<JSON>("/structure"),

    // get /api/v1/structure/metric

};