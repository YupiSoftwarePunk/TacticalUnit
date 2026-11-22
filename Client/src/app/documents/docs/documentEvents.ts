export interface DisplayDocumentEvent {
    key: string;
    id?: string;
    text: string;
    color?: string;
    dates?: string;
}

function formatDate(value: unknown): string | undefined {
    if (typeof value !== "string" || !value) return undefined;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return undefined;
    return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });
}

export function getDocumentEvents(document: { events?: unknown[] | null; states?: unknown[] | null }): DisplayDocumentEvent[] {
    const entries: DisplayDocumentEvent[] = [];
    function add(value: unknown, source: string, index: number) {
        if (!value || typeof value !== "object") return;
        const item = value as Record<string, unknown>;
        if (Array.isArray(item.history)) {
            item.history.forEach((child, childIndex) => add(child, `${source}-${index}`, childIndex));
            return;
        }
        const id = typeof item.id === "string" || typeof item.id === "number" ? String(item.id) : undefined;
        const text = typeof item.text === "string" ? item.text : typeof item.content === "string" ? item.content : "";
        const start = formatDate(item.start ?? item.dateTime);
        const end = formatDate(item.end);
        const dates = typeof item.dates === "string" ? item.dates : start && end ? `${start} — ${end}` : start;
        entries.push({ key: `${source}-${id ?? "unknown"}-${index}`, id, text: text || "Событие", color: typeof item.color === "string" ? item.color : undefined, dates });
    }
    document.events?.forEach((item, index) => add(item, "event", index));
    document.states?.forEach((item, index) => add(item, "state", index));
    return entries;
}
