export const REWARD_IMAGES: Record<string, string> = {
    "1": "/awards/Медаль _Герой Полиции_.png",
    "2": "/awards/Медаль _Выслуга времени III степени_.png",
    "3": "/awards/Медаль _Вклад в развитие РХБЗ I степени_.png",
    "4": "/awards/Знак отличия _Канцеляр III степени_.png",
    "5": "/awards/Знак отличия _Заслуженный ТЕХ_.png",
    "6": "/awards/Знак отличия _Заслуженный ПЕХ_.png",
    "7": "/awards/Звезда _Герой РХБЗ_.png",
    "8": "/awards/Медаль _Вклад в развитие РХБЗ II степени_.png",
    "9": "/awards/Медаль _Герой Полиции_.png",

    "default": "-_-.png" 
};

export const getRewardImage = (id: string | undefined, serverPath?: string | null): string => {
    if (serverPath && serverPath !== "-_-.jpg" && serverPath.startsWith("http")) {
        return serverPath;
    }
    return REWARD_IMAGES[String(id)] || REWARD_IMAGES["default"];
};

export const UNIT_IMAGES: Record<string, string> = {
    "рекрут": "/ranks/Рекрут.png",
    "рядовой": "/ranks/Рядовой.png",
    "сержант": "/ranks/Сержант.png",
    "старший лейтенант": "/ranks/Старший лейтенант.png",
    "старший прапорщик": "/ranks/Старший прапорщик.png",
    "старший сержант": "/ranks/Старший сержант.png",
    "старшина": "/ranks/Старшина.png",
    "default": "/AK-74__163.png"
};

export const getUnitImage = (rankName?: string): string => {
    if (!rankName) return UNIT_IMAGES["default"];
    const cleanName = rankName.toLowerCase().trim();
    
    return UNIT_IMAGES[cleanName] || UNIT_IMAGES["default"];
};