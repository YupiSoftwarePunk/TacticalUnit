import React from "react";

export const ProfilePage = () => {
    const actions = [
    { label: "+Rep (35)", type: "rep" },
    { label: "Редактировать избранные", type: "edit" },
    { label: "Редактировать должности", type: "edit" },
    { label: "Изменить звание", type: "edit" },
];

return (
    <main className="min-h-screen bg-bg-primary font-sans text-text-primary">
      {/* 1. Избранный фон (Banner) */}
        <div className="w-full h-48 bg-bg-accent flex items-center justify-center border-b border-border-primary overflow-hidden">
            <span className="font-stengazeta text-2xl opacity-50 uppercase tracking-widest">
            Избранный фон из перечня картинок
            </span>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 -mt-12 pb-20">
            {/* 2. Основная карточка профиля */}
            <div className="bg-bg-dark border border-border-primary shadow-2xl p-8 flex flex-col lg:flex-row gap-12">
            
            {/* ЛЕВАЯ КОЛОНКА: Инфо и Действия */}
            <div className="flex-shrink-0 w-full lg:w-64">
                <div className="flex gap-4 lg:flex-col items-start lg:items-center">
                {/* Аватар */}
                <div className="w-32 h-32 lg:w-48 lg:h-48 bg-bg-secondary border-2 border-border-secondary flex items-center justify-center">
                    <span className="text-6xl font-capture opacity-20">AV</span>
                </div>
                {/* Краткое инфо */}
                <div className="flex-1">
                    <p className="font-stengazeta text-text-secondary text-[30px] uppercase">Звание</p>
                    <h2 className="font-capture text-3xl text-accent leading-none mb-2 uppercase">Никнейм</h2>
                    <div className="space-y-1 font-sans text-xs text-text-secondary">
                    <p>Должность 1</p>
                    <p>Должность 2</p>
                    <div className="pt-2 flex gap-2">
                        <span className="text-red-500 font-bold uppercase">Статус 1</span>
                        <span className="text-green-500 font-bold uppercase">Статус 2</span>
                    </div>
                    <div className="pt-4">
                        <p className="opacity-50">Счётчик до повышения:</p>
                        <p className="font-black text-sm text-text-primary">12 / 30</p>
                    </div>
                    </div>
                </div>
                </div>

            {/* Список действий (Template) */}
            <ul className="mt-8 space-y-4 border-t border-white/5 pt-6">
            {[1, 2, 3, 4].map((group) => (
                <div key={group} className="space-y-1">
                {actions.map((action, idx) => (
                    <li 
                    key={idx} 
                    className={`text-[10px] uppercase font-bold tracking-tighter cursor-pointer hover:text-accent transition-colors text-right
                        ${action.type === 'rep' ? 'text-text-secondary' : 'text-text-secondary/60'}`}
                    >
                    {action.label}
                    </li>
                ))}
                </div>
            ))}
            </ul>
        </div>

        {/* ЦЕНТРАЛЬНАЯ КОЛОНКА: Активность */}
        <div className="flex-1 space-y-10">
            {/* История (кружки) */}
            <div className="flex flex-col items-center">
            <div className="flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-border-primary ${i % 2 === 0 ? 'bg-accent' : 'bg-blue-500'}`} />
                ))}
            </div>
            <button className="mt-2 text-[20px] uppercase font-stengazeta border-b border-text-secondary hover:text-accent transition-all">
                Посмотреть всю историю
            </button>
            </div>

            {/* Календарь активности (GitHub style) */}
            <div className="bg-white/5 p-4 rounded border border-white/5">
            <div className="flex justify-between text-[10px] font-stengazeta mb-2 opacity-50 uppercase">
                <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
            </div>
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 28 }).map((_, i) => (
                    <div 
                    key={i} 
                    className={`aspect-square rounded-sm border border-black/20 ${
                        [2, 5, 8, 9, 10, 11, 12, 18, 19, 20, 21, 22, 24, 25, 26].includes(i) 
                        ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' 
                        : 'bg-bg-secondary/30'
                    }`} 
                    />
                ))}
            </div>
            </div>

            {/* График (Бары) */}
            <div className="flex items-end justify-center gap-2 h-32 px-4 border-b border-white/10 pb-2">
            {[40, 60, 45, 80, 30, 95, 20].map((h, i) => (
                <div 
                key={i} 
                style={{ height: `${h}%` }} 
                className={`w-8 rounded-t-sm transition-all hover:brightness-125 ${h > 70 ? 'bg-green-500' : 'bg-green-800/60'}`}
                />
            ))}
            </div>
            <p className="text-center font-stengazeta text-[30px] opacity-30 uppercase tracking-[0.5em]">Май</p>
        </div>

          {/* ПРАВАЯ КОЛОНКА: Кит и Награды */}
        <div className="w-full lg:w-72 flex flex-col items-center lg:items-end">
            {/* Изображение кита */}
            <div className="relative group mb-4">
            <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-full opacity-50" />
            <img 
                src="https://placehold.co/300x400/222/555?text=KIT" // Замени на реальный путь к солдату
                alt="Squad Kit" 
                className="relative z-10 w-48 object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]"
            />
            </div>

            <div className="text-right w-full border-t border-white/5 pt-4">
            <p className="font-stengazeta text-[20px] text-text-secondary uppercase">Избранный кит</p>
            <h3 className="font-capture text-xl text-accent uppercase mb-4">Командир отряда</h3>
            
            {/* Сетка наград */}
            <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="group relative flex flex-col items-center">
                    <div className="w-8 h-12 bg-bg-secondary border border-border-secondary flex flex-col items-center justify-around py-1 transition-all cursor-help">
                    <span className="text-xs">🎖️</span>
                    <div className="w-4 h-4 rounded-full bg-accent/50 border border-white/20" />
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>

        </div>
    </div>
</main>
);
};