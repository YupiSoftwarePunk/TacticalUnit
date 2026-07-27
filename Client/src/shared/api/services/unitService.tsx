import { apiClient } from "../api";


export const UnitService = {
    add: (options: RequestInit) => apiClient<IUnit[]>("/unit", { method: "POST", ...options }),
    getAll: () => apiClient<IUnitCompressed[]>("/unit"),
    getActualUnits: () => apiClient<IUnit[]>("/unit/actual"),

    getByDiscordId: (id: number | string) => apiClient<IUnit>(`/unit/${id}`),
    deleteByDiscordId: (id: number | string, docId: number | string) => 
        apiClient<void>(`/unit/${id}?doc=${docId}`, { method: "DELETE" }),

    getStates: (id: number | string) => apiClient<IState[]>(`/unit/${id}/status`),
    appendStatus: (id: number | string, options : RequestInit, statusKey: number | string, docId?: number) => 
        apiClient<IState>(`/unit/${id}/status/${statusKey}${docId ? `?doc=${docId}` : ""}`, { method: "POST", ...options }),  //add | update status еще не закончен

    getActivity: (id: number | string) => apiClient<string[]>(`/unit/${id}/activity`),
    putActivity: (id: number | string, options : RequestInit) => 
        apiClient<Date>(`/unit/${id}/activity`, { method: "PUT", ...options }),  // fix activity

    getPermissions: (UnitDiscordId: number | string) => 
        apiClient<string[]>(`/unit/${UnitDiscordId}/permissions`), // получить все разрешения бойца.

    getDismissedUnits: () => apiClient<IUnit[]>(`/unit/dismissed`), 
    getRetiredUnits: () => apiClient<IUnit[]>(`/unit/retirement`), 
    
    getStateStory: (id : number | string) => apiClient<IUnitState[]>(`/unit/${id}/states`), 
    getEventStory: (id : number | string) => apiClient<ISingleDayEvent[]>(`/unit/${id}/events`), 

    getAvailableBg: (id : string) => apiClient<Map<string, string>>(`/unit/backgrounds`), 
    setUnitBg: (id : string, options : RequestInit) => 
        apiClient<Map<string, string>>(`/unit/backgrounds`, { method: "POST", ...options }),

    getAvailableKit: (id : string) => apiClient<Map<string, string>>(`/unit/kits`), 
    setUnitKit: (id : string, options : RequestInit) => 
        apiClient<Map<string, string>>(`/unit/kits`, { method: "POST", ...options }),

    getCanRank: () => apiClient<IUnit[]>("/unit/can/rank"),
    checkCanRankUnit: (targetDiscordId: number | string) => 
        apiClient<boolean>(`/unit/can/rank/${targetDiscordId}`),
    getCanPosts: () => apiClient<IPost[]>("/unit/can/posts"),
};