import { describe, expect, it } from "vitest";
import { buildActRequest, type ActSelection } from "./actRequest";

const base: ActSelection = {
    type: "rewards", unitIds: ["123456789012345678", "987654321098765432"],
    selectedIds: ["2", "5"], steps: 1, isDowngrade: false,
    ignorePostMaxRank: false, overwritePosts: false, overwriteStatus: false, endDate: "2026-12-31",
};

describe("act requests", () => {
    it("sends selected rewards and preserves Discord IDs as strings", () => {
        expect(buildActRequest(base)).toEqual({
            url: "/reward/assign", method: "POST",
            body: { UnitIds: base.unitIds, RewardIds: [2, 5] },
        });
    });
    it("sends posts and the chosen overwrite option", () => {
        expect(buildActRequest({ ...base, type: "posts", selectedIds: ["7"], overwritePosts: true, documentId: "3" }).body)
            .toEqual({ UnitIds: base.unitIds, DocId: 3, PostIds: [7], Overwrite: true });
    });
    it("assigns a rank without requiring a selected list item", () => {
        expect(buildActRequest({ ...base, type: "ranks", rankId: "4", selectedIds: [] }).body)
            .toEqual({ UnitIds: base.unitIds, RankId: 4 });
    });
    it("changes ranks without requiring an unrelated selection", () => {
        expect(buildActRequest({ ...base, type: "rank-altering", selectedIds: [], steps: 2, isDowngrade: true }).body)
            .toEqual({ UnitIds: base.unitIds, Steps: 2, IgnorePostMaxRank: false, IsDowngrade: true });
    });
    it("uses the current server status contract", () => {
        expect(buildActRequest({ ...base, type: "sanctions", statusId: "0", overwriteStatus: true }).body)
            .toEqual({ UnitIds: base.unitIds, StatusKey: 0, Ovewrite: true, End: "2026-12-31", Days: 777 });
    });
    it("builds retirement, dismissal, and return requests", () => {
        expect(buildActRequest({ ...base, type: "resignation" }).url).toBe("/unit/retirement");
        expect(buildActRequest({ ...base, type: "dismissal" })).toEqual({ url: "/unit", method: "DELETE", body: { UnitIds: base.unitIds } });
        expect(buildActRequest({ ...base, type: "returnal", rankId: "4", selectedIds: ["8"] })).toEqual({
            url: "/unit/actual", method: "POST", body: { UnitIds: base.unitIds, RankId: 4, PostIds: [8] },
        });
    });
    it("rejects missing or invalid inputs instead of sending an act", () => {
        expect(() => buildActRequest({ ...base, unitIds: [] })).toThrow();
        expect(() => buildActRequest({ ...base, selectedIds: [] })).toThrow();
        expect(() => buildActRequest({ ...base, type: "ranks" })).toThrow();
        expect(() => buildActRequest({ ...base, type: "returnal", rankId: "4", selectedIds: [] })).toThrow();
        expect(() => buildActRequest({ ...base, type: "rank-altering", steps: 0 })).toThrow();
        expect(() => buildActRequest({ ...base, type: "sanctions", statusId: "4" })).toThrow();
        expect(() => buildActRequest({ ...base, documentId: "bad" })).toThrow();
    });
});
