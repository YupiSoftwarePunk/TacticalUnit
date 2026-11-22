import { afterEach, expect, it, vi } from "vitest";
import { apiClient } from "../../../shared/api/api";
import { DocService } from "../../../shared/api/services/docsService";
import { submitAct } from "./submitAct";

afterEach(() => vi.unstubAllGlobals());

it("connects the multipart document endpoint to the act endpoint with authorization", async () => {
    vi.stubGlobal("window", {});
    vi.stubGlobal("localStorage", { getItem: () => "token" });
    const fetchMock = vi.fn()
        .mockResolvedValueOnce(new Response(JSON.stringify({ id: 42, title: "Приказ" }), { status: 200 }))
        .mockResolvedValueOnce(new Response(JSON.stringify({ message: "ok" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await submitAct({
        type: "rewards", unitIds: ["123456789012345678"], selectedIds: ["2"],
        steps: 1, isDowngrade: false, ignorePostMaxRank: false, overwritePosts: false,
        overwriteStatus: false, endDate: "2026-12-31",
    }, { mode: "new", file: new File(["content"], "order.pdf"), title: "Приказ" }, {
        createDocument: body => DocService.createNew({ body }),
        send: apiClient,
        onDocumentCreated: vi.fn(),
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [docUrl, docOptions] = fetchMock.mock.calls[0];
    expect(docUrl).toBe("http://localhost:5000/api/v1/doc");
    expect(docOptions.method).toBe("POST");
    expect(docOptions.headers).toEqual({ Authorization: "Bearer token" });
    expect(docOptions.body.get("Title")).toBe("Приказ");
    expect(docOptions.body.get("File").name).toBe("order.pdf");
    const [actUrl, actOptions] = fetchMock.mock.calls[1];
    expect(actUrl).toBe("http://localhost:5000/api/v1/reward/assign");
    expect(actOptions.headers.Authorization).toBe("Bearer token");
    expect(JSON.parse(actOptions.body)).toEqual({ UnitIds: ["123456789012345678"], DocId: 42, RewardIds: [2] });
});
