import { describe, expect, it, vi } from "vitest";
import { submitAct, type ActDocument } from "./submitAct";
import type { ActSelection } from "./actRequest";

const selection: ActSelection = {
    type: "rewards", unitIds: ["123456789012345678"], selectedIds: ["2"],
    steps: 1, isDowngrade: false, ignorePostMaxRank: false, overwritePosts: false,
    overwriteStatus: false, endDate: "2026-12-31",
};
const file = new File(["document"], "order.pdf", { type: "application/pdf" });
const newDocument: ActDocument = { mode: "new", file, title: " Приказ " };

function setup() {
    return {
        createDocument: vi.fn().mockResolvedValue({ id: "42" }),
        send: vi.fn().mockResolvedValue({}),
        onDocumentCreated: vi.fn(),
    };
}

describe("submitting an act with a document", () => {
    it("uploads the titled file before sending an act with its ID", async () => {
        const dependencies = setup();
        await submitAct(selection, newDocument, dependencies);
        const form = dependencies.createDocument.mock.calls[0][0] as FormData;
        expect(form.get("File")).toBe(file);
        expect(form.get("Title")).toBe("Приказ");
        expect(dependencies.createDocument.mock.invocationCallOrder[0]).toBeLessThan(dependencies.send.mock.invocationCallOrder[0]);
        expect(dependencies.onDocumentCreated).toHaveBeenCalledWith("42");
        expect(dependencies.send).toHaveBeenCalledWith("/reward/assign", {
            method: "POST", body: JSON.stringify({ UnitIds: selection.unitIds, DocId: 42, RewardIds: [2] }),
        });
    });

    it("sends an existing document ID or explicitly submits without a document", async () => {
        const dependencies = setup();
        await submitAct(selection, { mode: "existing", id: "7" }, dependencies);
        expect(JSON.parse(dependencies.send.mock.calls[0][1].body as string).DocId).toBe(7);
        await submitAct(selection, { mode: "empty" }, dependencies);
        expect(JSON.parse(dependencies.send.mock.calls[1][1].body as string)).not.toHaveProperty("DocId");
        expect(dependencies.createDocument).not.toHaveBeenCalled();
    });

    it("does not upload or send when the form is incomplete", async () => {
        const dependencies = setup();
        await expect(submitAct({ ...selection, unitIds: [] }, newDocument, dependencies)).rejects.toThrow();
        await expect(submitAct(selection, { mode: "selection" }, dependencies)).rejects.toThrow();
        await expect(submitAct(selection, { mode: "existing" }, dependencies)).rejects.toThrow();
        await expect(submitAct(selection, { mode: "new", file, title: " " }, dependencies)).rejects.toThrow();
        expect(dependencies.createDocument).not.toHaveBeenCalled();
        expect(dependencies.send).not.toHaveBeenCalled();
    });

    it("does not send the act if upload fails or returns no valid ID", async () => {
        const dependencies = setup();
        dependencies.createDocument.mockRejectedValueOnce(new Error("upload failed")).mockResolvedValueOnce({ id: undefined });
        await expect(submitAct(selection, newDocument, dependencies)).rejects.toThrow("upload failed");
        await expect(submitAct(selection, newDocument, dependencies)).rejects.toThrow("сервер не вернул корректный ID");
        expect(dependencies.send).not.toHaveBeenCalled();
    });

    it("reuses the uploaded ID if the act fails and the user retries", async () => {
        const dependencies = setup();
        dependencies.send.mockRejectedValueOnce(new Error("act failed"));
        await expect(submitAct(selection, newDocument, dependencies)).rejects.toThrow("act failed");
        await submitAct(selection, { ...newDocument, uploadedId: "42" }, dependencies);
        expect(dependencies.createDocument).toHaveBeenCalledOnce();
        expect(dependencies.send).toHaveBeenCalledTimes(2);
    });
});
