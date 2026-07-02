'use client';
import React from "react";
import { MainHeader } from "../Header/MainHeader";
import { BaseContainer, MultiroleInputField } from "../AdvancedMarkdownForGenericPages/AdvancedMarkdownForGenericPages";

interface ICreationForm{
    children?: React.ReactNode,
    title? : string,
    onClickSend? : ()=>void;
}
const CreationForm = ({children, title, onClickSend} : ICreationForm) =>{
    return(
    <div className="flex flex-1 flex-col size-full bg-bg-dark transition-all font-text-bold text-lg">
        <div className="flex mx-5 p-5 md:mx-[20%] bg-bg-primary transition-all">
            <div className="flex flex-col size-full gap-5">

                <h1 className={`flex justify-center text-accent self-center tracking-wider text-2xl py-2 transition-all`}>
                    {title&& `${title}`}
                </h1>
                <div className="flex flex-col gap-2">
                    {children}

                </div>
                <div className="flex justify-center">
                    <button onClick={onClickSend} type="submit" className="text-2xl px-15 py-5 bg-bg-secondary hover:bg-accent text-text-primary hover:text-black transition-all cursor-pointer">Отправить</button>
                </div>
            </div>
        </div>


    </div>)
}
export default CreationForm;