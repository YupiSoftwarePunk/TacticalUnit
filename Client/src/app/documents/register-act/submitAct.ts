import { buildActRequest, type ActSelection } from "./actRequest";

export type ActDocument =
    | { mode: "selection" }
    | { mode: "empty" }
    | { mode: "existing"; id?: string }
    | { mode: "new"; file: File | null; title: string; uploadedId?: string };

type Dependencies = {
    createDocument: (body: FormData) => Promise<{ id?: string | number }>;
    send: (url: string, options: RequestInit) => Promise<unknown>;
    onDocumentCreated: (id: string) => void;
};

export async function submitAct(selection: ActSelection, document: ActDocument, dependencies: Dependencies) {
    // Validate the act before creating a document, so invalid forms do not leave orphaned files.
    buildActRequest({ ...selection, documentId: undefined });

    let documentId: string | undefined;
    if (document.mode === "selection") throw new Error("Выберите способ добавления документа");
    if (document.mode === "existing") {
        if (!document.id) throw new Error("Выберите существующий документ");
        documentId = document.id;
    }
    if (document.mode === "new") {
        if (!document.file || !document.title.trim()) throw new Error("Укажите название документа и выберите файл");
        documentId = document.uploadedId;
        if (!documentId) {
            const body = new FormData();
            body.append("File", document.file);
            body.append("Title", document.title.trim());
            const created = await dependencies.createDocument(body);
            if (created?.id == null || !/^\d+$/.test(String(created.id)) || Number(created.id) <= 0 || Number(created.id) > 2147483647) {
                throw new Error("Документ загружен, но сервер не вернул корректный ID. Проверьте архив документов перед повторной попыткой.");
            }
            documentId = String(created.id);
            dependencies.onDocumentCreated(documentId);
        }
    }

    const request = buildActRequest({ ...selection, documentId });
    await dependencies.send(request.url, { method: request.method, body: JSON.stringify(request.body) });
}
