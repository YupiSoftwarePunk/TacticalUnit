import { afterEach, describe, expect, it, vi } from "vitest";
import { downloadDocument } from "./documentDownload";

afterEach(() => vi.unstubAllGlobals());

describe("document download", () => {
    it("reports a missing file rather than silently opening a broken link", async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 404 }));
        vi.stubGlobal("fetch", fetchMock);
        await expect(downloadDocument("12", "Приказ")).rejects.toThrow("Сервер пока не сообщает формат");
        expect(fetchMock).toHaveBeenCalledWith("http://localhost:5000/docs/12.doc");
    });

    it("downloads an available doc file and releases its temporary URL", async () => {
        const anchor = { href: "", download: "", click: vi.fn(), remove: vi.fn() };
        const appendChild = vi.fn();
        vi.stubGlobal("window", { document: { createElement: () => anchor, body: { appendChild } } });
        vi.stubGlobal("URL", { createObjectURL: vi.fn().mockReturnValue("blob:test"), revokeObjectURL: vi.fn() });
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("document")));
        await downloadDocument("12", "Приказ");
        expect(anchor.href).toBe("blob:test");
        expect(anchor.download).toBe("Приказ.doc");
        expect(anchor.click).toHaveBeenCalledOnce();
        expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:test");
    });

    it("rejects invalid document IDs", async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        await expect(downloadDocument("../file", "Приказ")).rejects.toThrow("Некорректный ID");
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
