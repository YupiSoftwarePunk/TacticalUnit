function optionalId(value: string | number | undefined): number | null {
    if (value == null || value === "") return null;
    const id = Number(value);
    if (!Number.isSafeInteger(id) || id <= 0 || id > 2147483647) throw new Error("Некорректный идентификатор");
    return id;
}

export function postUpdateBody(post: IPost) {
    const maxRankId = optionalId(post.maxRankId);
    if (maxRankId === null) throw new Error("Не указано максимальное звание должности");
    return { name: post.name, color: post.color, description: post.description,
        appendSubdivisionName: post.appendSubdivisionName, maxRankId,
        subdivisionId: optionalId(post.subdivisionId), headId: optionalId(post.headId) };
}

export function subdivisionUpdateBody(subdivision: ISubdivision) {
    return { name: subdivision.name, color: subdivision.color, headId: optionalId(subdivision.headId) };
}

export function rewardUpdateBody(reward: IReward) {
    return { name: reward.name, color: reward.color, conditions: reward.conditions, privileges: reward.privileges };
}
