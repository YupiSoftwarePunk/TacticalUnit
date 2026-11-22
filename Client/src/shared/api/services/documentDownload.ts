import { getBaseMediaURL } from "../api";

/** The current server exposes static files by ID and extension, but does not return the extension. */
export async function downloadDocument(docId: string, title: string) {
    if (!/^\d+$/.test(docId)) throw new Error("Некорректный ID документа");
    const response = await fetch(`${getBaseMediaURL()}/docs/${docId}.doc`);
    if (!response.ok) {
        throw new Error("Не удалось скачать файл. Сервер пока не сообщает формат документа; файл может иметь другое расширение.");
    }

    const file = await response.blob();
    const url = URL.createObjectURL(file);
    try {
        const link = window.document.createElement("a");
        link.href = url;
        link.download = title.toLowerCase().endsWith(".doc") ? title : `${title}.doc`;
        window.document.body.appendChild(link);
        link.click();
        link.remove();
    } finally {
        URL.revokeObjectURL(url);
    }
}
