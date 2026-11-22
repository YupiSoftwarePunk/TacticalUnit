export interface ActSelection {
    type: string | null;
    unitIds: string[];
    documentId?: string;
    selectedIds: string[];
    rankId?: string;
    steps: number;
    isDowngrade: boolean;
    ignorePostMaxRank: boolean;
    overwritePosts: boolean;
    statusId?: string;
    overwriteStatus: boolean;
    endDate: string;
}

function entityId(value: string | undefined, message: string): number {
    if (!value || !/^\d+$/.test(value)) throw new Error(message);
    const id = Number(value);
    if (!Number.isSafeInteger(id) || id <= 0 || id > 2147483647) throw new Error(message);
    return id;
}

export function buildActRequest(selection: ActSelection) {
    if (selection.unitIds.length === 0) throw new Error("Выберите хотя бы одного бойца");
    const common = {
        UnitIds: selection.unitIds,
        ...(selection.documentId ? { DocId: entityId(selection.documentId, "Некорректный документ") } : {}),
    };
    const ids = () => {
        if (!selection.selectedIds.length) throw new Error("Выберите хотя бы один элемент");
        return selection.selectedIds.map(id => entityId(id, "Некорректный идентификатор"));
    };
    switch (selection.type) {
        case "rewards":
            return { url: "/reward/assign", method: "POST", body: { ...common, RewardIds: ids() } };
        case "posts":
            return { url: "/post/assign", method: "POST", body: { ...common, PostIds: ids(), Overwrite: selection.overwritePosts } };
        case "ranks":
            return { url: "/rank/assign", method: "POST", body: { ...common, RankId: entityId(selection.rankId, "Выберите звание") } };
        case "rank-altering":
            if (!Number.isSafeInteger(selection.steps) || selection.steps < 1) throw new Error("Укажите количество ступеней больше нуля");
            return { url: "/rank/change", method: "POST", body: { ...common, Steps: selection.steps, IgnorePostMaxRank: selection.ignorePostMaxRank, IsDowngrade: selection.isDowngrade } };
        case "sanctions": {
            if (!selection.statusId || !["0", "1", "2", "3"].includes(selection.statusId)) throw new Error("Выберите тип статуса");
            if (!selection.endDate) throw new Error("Укажите дату окончания статуса");
            return { url: "/unit/status", method: "POST", body: { ...common, StatusKey: Number(selection.statusId), Ovewrite: selection.overwriteStatus, End: selection.endDate, Days: 777 } };
        }
        case "resignation":
            return { url: "/unit/retirement", method: "POST", body: common };
        case "dismissal":
            return { url: "/unit", method: "DELETE", body: common };
        case "returnal":
            return { url: "/unit/actual", method: "POST", body: { ...common, RankId: entityId(selection.rankId, "Выберите звание"), PostIds: ids() } };
        default:
            throw new Error("Неизвестный тип акта");
    }
}
