import { apiClient } from "../api";

const BASE_URL = "http://localhost:5000/api";

export const ImageService = {
    uploadReward: (id: number | string, options: RequestInit) => 
        apiClient<IImageUploadResponse>(`/images/rewards/${id}`, options),

    uploadRank: (id: number | string, options: RequestInit) => 
        apiClient<IImageUploadResponse>(`/images/ranks/${id}`, options),


    getRewardUrl: (id: number | string) => `${BASE_URL}/images/rewards/${id}`,

    getRankUrl: (id: number | string) => `${BASE_URL}/images/ranks/${id}`,
};