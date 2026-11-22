import { afterEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "./api";

afterEach(() => vi.unstubAllGlobals());

describe("apiClient", () => {
    it("sends the bearer token and accepts an empty successful response", async () => {
        vi.stubGlobal("window", {});
        vi.stubGlobal("localStorage", { getItem: () => "test-token" });
        const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
        vi.stubGlobal("fetch", fetchMock);

        await expect(apiClient("/unit", { method: "DELETE", body: JSON.stringify({ UnitIds: ["123"] }) })).resolves.toBeUndefined();
        expect(fetchMock).toHaveBeenCalledWith("http://localhost:5000/api/v1/unit", expect.objectContaining({
            method: "DELETE",
            headers: expect.objectContaining({ Authorization: "Bearer test-token", "Content-Type": "application/json" }),
        }));
    });
});
