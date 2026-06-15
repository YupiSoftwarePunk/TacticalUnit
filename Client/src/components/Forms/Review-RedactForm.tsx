import { useEffect, useState } from "react";
import { MainHeader } from "../Header/MainHeader";


interface IRRForm{
    title? : string,
    saveChangesMethod? : ()=>void,
    setEditModeMethod? : React.Dispatch<React.SetStateAction<boolean>>,
    setShowSaveChangesMethod? : React.Dispatch<React.SetStateAction<boolean>>,
    showSaveChangesButton? : boolean,
    editable? : boolean,
    children? : React.ReactNode
}

export const RRForm = ({saveChangesMethod, title, setEditModeMethod, setShowSaveChangesMethod, showSaveChangesButton = false, editable = false, children} : IRRForm) =>{

    const [editing, setEditing] = useState(false);
    const [mouseIsInsideChildrenContainer, setMouseIsInsideChildrenContainer] = useState(false);


    return(<div className="flex flex-col min-h-screen " >
            {editable&&
            <button onClick={saveChangesMethod!} className={`fixed z-10 bottom-10 self-center text-text-primary bg-bg-primary border border-accent px-10 py-3 text-2xl hover:bg-accent hover:text-black cursor-pointer transition-all `} style={{bottom: `${showSaveChangesButton?  "40px" : "-80px"}`}}>Сохранить изменения</button>
            }
            <div className="flex">
                <MainHeader></MainHeader>
            </div>

            <div className="flex flex-col flex-1 w-full bg-bg-dark transition-colors duration-300" onClick={()=>{}}>
                <div className="flex flex-col p-5 gap-2 self-center bg-bg-primary min-w-20 w-full mx-3 md:w-[70%] shadow-2xl ">
                    {title&&
                    <h1 className="flex  text-accent font-text-bold uppercase tracking-wider self-center text-3xl transition-all">{title}</h1>
                    }
                    {children}
                </div>
            </div>
        </div>)
}