import { afterEach, describe, expect, it, vi } from "vitest";
import { uploadDocument } from "./uploadDocument";

afterEach(() => vi.unstubAllGlobals());

describe("document upload", () => {
    it("sends the file and title to the existing endpoint with authorization", async () => {
        vi.stubGlobal("window", {});
        vi.stubGlobal("localStorage", { getItem: () => "token" });
        const fetchMock = vi.fn().mockResolvedValue(new Response('{"id":"42"}', { status: 200 }));
        vi.stubGlobal("fetch", fetchMock);
        const file = new File(["content"], "order.pdf");

        await uploadDocument(file, " Приказ ", new Set());

        const [url, options] = fetchMock.mock.calls[0];
        expect(url).toBe("http://localhost:5000/api/v1/doc");
        expect(options.method).toBe("POST");
        expect(options.headers).toEqual({ Authorization: "Bearer token" });
        expect(options.body.get("File")).toBe(file);
        expect(options.body.get("Title")).toBe("Приказ");
        expect(options.body.has("UnitIds")).toBe(false);
    });

    it("rejects missing data before sending", async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        const file = new File(["content"], "order.pdf");
        await expect(uploadDocument(null, "Приказ", new Set())).rejects.toThrow();
        await expect(uploadDocument(file, " ", new Set())).rejects.toThrow();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("preserves selected Discord IDs in the upload request", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response('{"id":"42"}', { status: 200 })));
        const fetchMock = vi.mocked(fetch);
        await uploadDocument(new File(["x"], "x.pdf"), "Приказ", new Set(["123456789012345678"]));
        const options = fetchMock.mock.calls[0][1];
        expect((options?.body as FormData).getAll("UnitIds")).toEqual(["123456789012345678"]);
    });

    it("propagates a server error", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response('{"error":"Нет прав"}', { status: 403 })));
        await expect(uploadDocument(new File(["x"], "x.pdf"), "Приказ", new Set())).rejects.toThrow("Нет прав");
    });
});
