import { DocService } from "../../../shared/api/services/docsService";

export async function uploadDocument(file: File | null, title: string, unitIds: Set<string>) {
    if (!file || !title.trim()) throw new Error("Заполните название документа и выберите файл");
    const body = new FormData();
    body.append("File", file);
    body.append("Title", title.trim());
    unitIds.forEach(id => body.append("UnitIds", id));
    return DocService.createNew({ body });
}
