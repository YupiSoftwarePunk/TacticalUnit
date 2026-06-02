export function validateColor(hexCode : string){
    if (!hexCode.startsWith("#")) return false;
    if (hexCode.replace("#", "").length > 6 || hexCode.replace("#", "").length < 6 ) return false;
    return true
}