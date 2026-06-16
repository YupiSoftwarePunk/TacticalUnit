'use client';
import { BaseContainer, ColorInputField, DescriptionInputField, MultiroleInputField } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import CreationForm from "@/components/Forms/CreationForm";
import { MainHeader } from "@/components/Header/MainHeader";
import Tooltip from "@/components/ToolTip/ToolTip";
import { RewardService } from "@/shared/api/services/RewardService";
import { ImageService } from "@/shared/api/services/imageService";
import { validateColor } from "@/typescript/colorValidator";
import { useState, ChangeEvent, useEffect } from "react";

export default function CreateSubdivPage() {
    const [rewardName, setRewardName] = useState<string>("");
    const [privileges, setPrivileges] = useState<string>("");
    const [conditions, setConditions] = useState<string>("");
    const [color, setColor] = useState<string>("#ffffff");

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveFile = () => {
        setImageFile(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
    };

    // Переводим функцию на async, так как у нас цепочка из двух сетевых запросов
    async function sendForm() {
        let problems: string = "";
        if (rewardName.replace(' ', '').length == 0) {
            problems += "Название награды\n";
        }
        if (privileges.replace(" ", "") == "") {
            problems += "Привилегии награды\n";
        }
        if (conditions.replace(" ", "") == "") {
            problems += "Условия получения награды\n";
        }
        if (problems) {
            alert("Вы забыли указать:\n" + problems);
            return;
        }
        if (!validateColor(color)) {
            alert("Цвет указан с ошибками, проверьте, что цвет начинается с \"#\" и содержит 6 символов после \"#\"");
            return;
        }

        let newRank: IReward = {
            color: color,
            conditions: conditions,
            privileges: privileges,
            name: rewardName
        };
        
        try {
            // Шаг 1: Сначала отправляем текстовые данные и ждем создания сущности на бэкенде
            const createdReward = await RewardService.add(newRank);

            // Шаг 2: Если пользователь выбрал файл, отправляем его вторым запросом
            if (imageFile && createdReward?.id) {
                const formData = new FormData();
                // Ключ обязательно должен называться "file", как в аргументе C# контроллера: [FromForm] IFormFile file
                formData.append("file", imageFile); 

                // Вызываем метод твоего ImageService
                await ImageService.uploadReward(createdReward.id, {
                    method: "POST",
                    body: formData
                });

                alert(`Награда "${createdReward.name}" и её изображение успешно созданы!`);
            } else {
                alert(`Награда "${createdReward.name}" успешно создана! Будет использовано стандартное изображение.`);
            }

            // Очищаем форму только в случае успеха обоих запросов
            resetForm();

        } catch (err) {
            console.error("Ошибка при создании награды или отправке картинки:", err);
            alert("Не удалось создать награду. Проверьте консоль для подробностей.");
        }
    }

    const resetForm = () => {
        setRewardName("");
        setPrivileges("");
        setConditions("");
        setColor("#ffffff");
        handleRemoveFile();
    };

    return (
        <div className="flex flex-col min-h-screen">
            <MainHeader></MainHeader>

            <CreationForm title="Создание награды" onClickSend={() => { sendForm() }}>
                <div className="flex flex-1 gap-3 w-full">

                    <Tooltip tooltipText="Картинка награды" className="flex flex-1 max-w-50" innerClassName="flex">
                        <div className="flex flex-col flex-1 h-full w-full">
                            <div className="relative bg-gray-100 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/5 flex items-center justify-center group min-h-[160px] w-full transition-all">
                                
                                {imagePreview ? (
                                    <>
                                        <img 
                                            src={imagePreview} 
                                            alt="Award Preview" 
                                            className="flex self-start object-top object-contain overflow-hidden w-full h-full"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={handleRemoveFile}
                                            className="absolute bottom-2 right-2 p-1.5 bg-black/10 dark:bg-black/50 hover:bg-red-600 opacity-60 hover:opacity-100 transition-all border border-black/20 dark:border-white/10 text-white text-[10px] font-text-bold uppercase tracking-wider px-2"
                                        >
                                            Удалить
                                        </button>
                                    </>
                                ) : (
                                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-4 text-center group hover:bg-black/5 dark:hover:bg-white/5 transition-colors min-h-[160px]">
                                        <span className="text-[11px] font-text-bold text-accent uppercase tracking-widest border-b border-accent group-hover:text-text-primary group-hover:border-text-primary transition-colors">
                                            Выбрать файл
                                        </span>
                                        <span className="text-[9px] text-text-primary/40 mt-1.5 uppercase tracking-wider">
                                            PNG, JPG, WEBP
                                        </span>
                                        <input 
                                            type="file" 
                                            accept="image/png, image/jpeg, image/jpg, image/webp" 
                                            className="hidden" 
                                            onChange={handleFileChange} 
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    </Tooltip>

                    <div className="flex flex-col flex-4 gap-3">

                        <BaseContainer>
                            <ColorInputField 
                                watermark="Цвет" 
                                value={color} 
                                editMode={true} 
                                onChange={(e) => { setColor(e.target.value) }} 
                                editable={true}
                            />
                        </BaseContainer>

                        <BaseContainer className="flex-col">
                            <MultiroleInputField 
                                tooltip="Наименование награды" 
                                watermark="Название награды" 
                                value={rewardName} 
                                editMode={true} 
                                onChange={(e) => { setRewardName(e.target.value) }} 
                                editable={true}
                            />
                            <DescriptionInputField 
                                watermark="Условия получения награды" 
                                displayOnEmpty="[ Условия получения награды не заполнены ]" 
                                value={conditions} 
                                onChange={(e) => { setConditions(e.target.value) }} 
                                editMode={true} 
                                editable={true}
                            />
                        </BaseContainer>

                        <BaseContainer className="flex-col">
                            <DescriptionInputField 
                                watermark="Привилегии награды" 
                                displayOnEmpty="[ Привилегии награды не заполнены ]" 
                                value={privileges} 
                                onChange={(e) => { setPrivileges(e.target.value) }} 
                                editMode={true} 
                                editable={true}
                            />
                        </BaseContainer>
                        
                    </div>
                </div>
            </CreationForm>
        </div>
    );
}