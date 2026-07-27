import { apiClient } from "../api";

const STATIC_BASE_URL = "http://localhost:5000"; 

export const IMAGE_FOLDERS = {
    reward: "rewards",
    rank: "ranks",
    background: "backgrounds",
    kit: "kits"
} as const;

export type ImageType = keyof typeof IMAGE_FOLDERS;

export interface IImageUploadResponse {
    message: string;
    fileName: string;
}

export const ImageService = {
    uploadReward: (id: number | string, options: RequestInit) => 
        apiClient<IImageUploadResponse>(`/images/rewards/${id}`, { method: "POST", ...options }),

    uploadRank: (id: number | string, options: RequestInit) => 
        apiClient<IImageUploadResponse>(`/images/ranks/${id}`, { method: "POST", ...options }),

    uploadBackground: (id: number | string, options: RequestInit) => 
        apiClient<IImageUploadResponse>(`/images/backgrounds/${id}`, { method: "POST", ...options }),

    uploadKit: (id: number | string, options: RequestInit) => 
        apiClient<IImageUploadResponse>(`/images/kits/${id}`, { method: "POST", ...options }),

    getEntityImageUrl: (type: ImageType, id: number | string) => {
        const folder = IMAGE_FOLDERS[type];
        return `${STATIC_BASE_URL}/${folder}/${id}`;
    },

    getDefaultImageUrl: (type: ImageType) => {
        const folder = IMAGE_FOLDERS[type];
        return `${STATIC_BASE_URL}/${folder}/default`;
    }
};