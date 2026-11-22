import { describe, expect, it } from "vitest";
import { getDocumentEvents } from "./documentEvents";

describe("document events", () => {
    it("displays server events and states, including their UTC dates", () => {
        const events = getDocumentEvents({
            events: [{ id: "2", text: "Награждение", color: "#ffaa00", dateTime: "2026-11-22T23:30:00Z" }],
            states: [{ id: 2, text: "Должность", start: "2026-11-01T00:00:00Z", end: "2026-11-03T00:00:00Z" }],
        });
        expect(events).toEqual([
            { key: "event-2-0", id: "2", text: "Награждение", color: "#ffaa00", dates: "22.11.2026" },
            { key: "state-2-0", id: "2", text: "Должность", color: undefined, dates: "01.11.2026 — 03.11.2026" },
        ]);
    });

    it("preserves support for existing grouped history and handles missing data", () => {
        expect(getDocumentEvents({ events: [{ history: [{ id: "9", content: "Событие", dates: "Вчера" }] }], states: null }))
            .toEqual([{ key: "event-0-9-0", id: "9", text: "Событие", color: undefined, dates: "Вчера" }]);
        expect(getDocumentEvents({ events: null, states: undefined })).toEqual([]);
    });

    it("ignores invalid entries and dates", () => {
        expect(getDocumentEvents({ events: [null, { id: 1, dateTime: "invalid" }], states: [] }))
            .toEqual([{ key: "event-1-1", id: "1", text: "Событие", color: undefined, dates: undefined }]);
    });
});
