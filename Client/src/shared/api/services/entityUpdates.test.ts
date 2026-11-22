import { describe, expect, it } from "vitest";
import { postUpdateBody, rewardUpdateBody, subdivisionUpdateBody } from "./entityUpdates";

describe("entity update payloads", () => {
    it("includes all fields consumed by the post update endpoint", () => {
        const body = postUpdateBody({ name: "Офицер", color: "#123456", description: "Описание", appendSubdivisionName: true,
            maxRankId: "7", subdivisionId: "3", headId: "4", fullname: "", index: 1, permissions: [], allPermissions: [] });
        expect(body).toEqual({ name: "Офицер", color: "#123456", description: "Описание", appendSubdivisionName: true,
            maxRankId: 7, subdivisionId: 3, headId: 4 });
    });
    it("does not silently convert invalid post IDs", () => {
        expect(() => postUpdateBody({ name: "A", color: "#000000", description: "", appendSubdivisionName: false,
            maxRankId: "bad", fullname: "", index: 1, permissions: [], allPermissions: [] })).toThrow();
    });
    it("sends only the subdivision fields the current server actually saves", () => {
        expect(subdivisionUpdateBody({ name: "Штаб", color: "#123456", description: "Описание", appendHeadName: false,
            headId: "2", givedPermissions: [] })).toEqual({ name: "Штаб", color: "#123456", headId: 2 });
    });
    it("sends all editable reward fields", () => {
        expect(rewardUpdateBody({ name: "Награда", color: "#123456", conditions: "Условие", privileges: "Права" }))
            .toEqual({ name: "Награда", color: "#123456", conditions: "Условие", privileges: "Права" });
    });
});
