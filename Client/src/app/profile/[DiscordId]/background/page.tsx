'use client';
import { ListedInputField } from "@/components/AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";
import { MainHeader } from "@/components/Header/MainHeader";
import { UnitService } from "@/shared/api/services/unitService";
import { ChevronDown, SquareChevronDown } from "lucide-react";
import React, { useEffect } from "react";
import { useState } from "react";

export default function BackgroundPage({ params }: { params: Promise<{ DiscordId: string }> }){
    const { DiscordId } = React.use(params);
    const [images, setImages] = useState<IProfileAttribute[]>([
        {
        name: "Картинка 1",
        id: "0"
        },
        {
        name: "Картинка 2",
        id: "1"
        },
        {
        name: "Картинка 3",
        id: "2"
        },
        {
        name: "Картинка 4",
        id: "3"
        },
        {
        name: "Картинка 5",
        id: "4"
        },
    ]);
    useEffect(()=>{
        const preparedImages : IProfileAttribute[] = [];
        UnitService.getAvailableBg(DiscordId).then((bgs=>{
            const allKeys = bgs.keys();
            allKeys.forEach(key => {
                preparedImages.push({name: key, id: bgs.get(key)!});
            });
        }))
        setImages(preparedImages);
        if (preparedImages.length > 0) {
            setCurrentImage(preparedImages[0]);
        }
    },[])
    
    const [currentImage, setCurrentImage] = useState<IProfileAttribute>(images[0]);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    function ChooseBg(bg: IProfileAttribute){
        setCurrentImage(bg);
    }
    function Save(){
        UnitService.setUnitBg(DiscordId, {body: JSON.stringify(currentImage.id)});
    }

    return(<div className="flex flex-col min-h-screen min-w-screen bg-bg-dark transition-all">
        <MainHeader></MainHeader>
        <div className="bg-bg-primary flex flex-col flex-1 h-20 mx-5 transition-all items-center p-5 gap-5 text-text-primary">
            <h1 className="flex  font-text-bold text-2xl tracking-wider">Шапка профиля</h1>
            <div className="flex flex-1 border border-border-secondary bg-bg-dark aspect-video max-w-full"></div>
            <div className="flex relative">
                <div className={`absolute bottom-full overflow-scroll max-h-50 ${isMenuOpen? "min-h-10": "min-h-0 opacity-0"}  min-w-60 flex flex-col px-2 gap-2 py-2 bg-bg-primary border border-border-secondary transition-all cursor-auto`} style={{maxHeight: `${isMenuOpen? "": "0px"}`}} >
                    {images.filter(x=>x.id != currentImage.id).map((item)=>(
                        <button key={item.id} onClick={()=>{ChooseBg(item); setIsMenuOpen(false)}} className="flex px-4 py-2 bg-bg-secondary hover:bg-accent hover:text-black transition-all">{item.name}</button>
                    ))}
                </div>

                <button className="flex relative self-center gap-5 bg-bg-secondary py-4 px-8 hover:bg-bg-dark transition-all cursor-pointer justify-center" onClick={()=>{setIsMenuOpen(!isMenuOpen)}}>
                    <div className="flex font-text-bold">{currentImage.name}</div>
                    <ChevronDown className={`transition-all`} style={{rotate: `${isMenuOpen? "0deg": "180deg"}`}}></ChevronDown>
                </button>
            </div>
            <button className="flex font-text-bold bg-bg-secondary px-4 py-2 hover:bg-accent hover:text-black transition-all">Сохранить</button>
        </div>
    </div>)
}