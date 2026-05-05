'use client'
import { MainHeader } from "@/components/Header/MainHeader";

export default function Profile(){
    return(
        <div className="flex flex-col min-h-screen text-text-secondary">
            {/* <MainHeader></MainHeader> */}
            <div className="flex min-h-[250px] h-[30vh] bg-black relative">
                <img src="#" alt="Profile background image" className="flex object-top object-cover self-center size-full text-white"/>
                <button className="absolute transform bg-bg-primary px-4 py-1 rounded-md transition-all hover:bg-bg-accent bottom-4 right-4">Заменить баннер</button>
            </div>
            <div className="flex max-md:flex-col flex-1 bg-bg-primary py-8 text-xl">
                <div className="flex flex-3 justify-end border-r border-border-primary">
                    <div className="flex flex-col text-end gap-2">
                        <div className="flex size-60 bg-black self-end relative">
                            <img src="#" alt="Profile image" className="object-top object-cover self-center size-full text-white"/>
                        </div>
                        <ul className="flex flex-col gap-1 pr-4 items-end">
                            <button className=" hover:text-accent transition-all">Заменить баннер</button>
                            <button className=" hover:text-accent transition-all">Какая-то опция</button>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-4 px-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col">
                            <p >Звание</p>
                            <p className="text-text-secondary-accent text-3xl">Никнейм</p>
                        </div>
                        <ul className="flex flex-col"> 
                            <p>Должность 1</p>
                            <p>Должность 2</p>
                        </ul>
                        <div className="flex flex-col">
                            <p>
                                Статусы:
                            </p>
                            <ul className="flex gap-2">
                                <p className="flex ">Статус 1</p>
                                <p className="flex ">Статус 2</p>
                            </ul>
                        </div>
                        <div className="flex flex-col justify-items-center">
                            <p className="text-text-primary">Счётчик до повышения</p>
                            <div className="flex self-center text-text-secondary">
                                <p>32</p>
                                <p>/</p>
                                <p>100</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-3 justify-start gap-4">
                    <div className="flex size-80 border-b border-border-primary">
                        <img src="AK-74__163.png" alt="Soldier of heaven" className="object-top object-cover self-center size-full text-white"/>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-text-secondary-accent">Командир отряда</p>
                        <div className="flex flex-wrap max-w-77 gap-1">
                            <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                            <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                            <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                            <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                            <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                            <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                            <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                            <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                            <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                            <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                            <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                            <div className="w-10 h-18 bg-bg-dark"><img src="-_-.jpg" alt="" className="size-full object-center object-cover" /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}