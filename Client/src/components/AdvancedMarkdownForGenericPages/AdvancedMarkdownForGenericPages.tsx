import { ChangeEvent, CSSProperties, useState } from "react"
import Tooltip from "../ToolTip/ToolTip"

interface IBaseContainer{
    className? : string
    children? : React.ReactNode
    onClick? : () => void
    style? : CSSProperties
    tooltip? : string
}
export const BaseContainer = ({className, children, onClick, style, tooltip} : IBaseContainer) => {
    return <Tooltip tooltipText={tooltip? tooltip:""} className={`flex gap-5 relative border w-full h-full border-black/10 dark:border-white/5 bg-gray-100 dark:bg-[#1a1a1a] p-4 group pointer-events-auto ${className? className : ""}`}>
        <div className={`flex gap-5 relative w-full h-full group pointer-events-auto ${className? className : ""}`} style={style} onClick={onClick}>
            {children}
        </div>
    </Tooltip>
}

interface IMultiroleInputField{
    className? : string
    editingClassName? : string
    editable? : boolean
    editMode? : boolean
    onClick? : () => void
    onChange? : (e : ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
    value? : string | number
    tooltip? : string
    type? : "text" | "num"
}

export const MultiroleInputField = ({className = "", editingClassName = "", editable, onClick, onChange, value, editMode, tooltip, type="text"} : IMultiroleInputField) =>{
    //const [editMode, setEditMode] = useState<boolean>();
    return  <Tooltip tooltipText={tooltip? tooltip:""} className={`flex relative size-full`}>
        <div className="flex flex-1 gap-5" onClick={onClick}>
            <div className={`flex text-accent font-text-bold uppercase tracking-wider text-lg py-2 transition-all ${className} ${editMode? "absolute pointer-events-none" : ""}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
                <h1 className={`flex text-accent font-text-bold uppercase tracking-wider text-lg transition-all ${editMode? "opacity-0" : ""}`} >
                {`${value}`}
                </h1>
                </div>
                {editable &&
                type == "text" &&
                <div className={`flex flex-col ${editingClassName} ${editMode? "" : "absolute opacity-0 pointer-events-none size-full"} flex-1 transition-all`}>
                    <input value={value} type="text" onChange={onChange} className={`flex ${editMode? "" : " opacity-0 pointer-events-none"} inset-4 flex flex-1 text-accent font-text-bold uppercase tracking-wider text-lg resize-none py-2 bg-bg-primary transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}/>
                            
                </div>
                }
                {editable &&
                type == "num" &&
                <div className={`flex flex-col ${editingClassName} ${editMode? "" : "absolute opacity-0 pointer-events-none size-full"} flex-1 transition-all`}>
                    <input value={value} type="number" onChange={onChange} className={`flex ${editMode? "" : " opacity-0 pointer-events-none"} inset-4 flex flex-1 text-accent font-text-bold uppercase tracking-wider text-lg resize-none py-2 bg-bg-primary transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}/>
                            
                </div>
                }
        </div>
    </Tooltip>
}

// interface IDescriptionInputField{
//     className? : string
//     editingClassName? : string
//     editable? : boolean
//     editMode? : boolean
//     onClick? : () => void
//     onChange? : (e : ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) => void
//     value? : string | number
//     tooltip? : string
//     type? : "text" | "num"
// }

// export const DescriptionInputField = ({className = "", editingClassName = "", editable, onClick, onChange, value, editMode, tooltip} : IDescriptionInputField) =>{
//     //const [editMode, setEditMode] = useState<boolean>();
//     return  <Tooltip tooltipText={tooltip? tooltip:""} className={`flex relative size-full ${className}`}>

//                 <p className={`flex absolute text-black dark:text-text-primary font-text text-sm leading-relaxed pr-8 transition-all  py-2  ${editMode? "absolute pointer-events-none" : ""}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
//                 {`${value}`}
//                 </p>

//                 {editable&&

//                 <textarea value={value} spellCheck="false"  onChange={(e)=>{if (onChange) onChange(e)}} className={`flex inset-4 ${editingClassName} ${editMode? "" : "absolute opacity-0 pointer-events-none"} resize-none flex absolute flex-1 text-black dark:text-text-primary font-text text-sm leading-relaxed py-2 bg-bg-primary transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}/>
//                 }
//             </Tooltip>
// }

// interface IListedInputField<T>{
//     className? : string
//     editingClassName? : string
//     editable? : boolean
//     editMode? : boolean
//     onClick? : () => void
//     onChange? : (e : ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
//     onChoice? : (chosenElement : T) => void
//     value? : string | number
//     list? : T[]
//     style? : CSSProperties
//     tooltip? : string
// }

// export function ListedInputField<T>({className, editingClassName, editable, onClick, onChange, value, editMode, style, tooltip, onChoice} : IListedInputField<T>){
//     //const [editMode, setEditMode] = useState<boolean>();
//     const [isFocused, setIsFocused] = useState<boolean>(false);
//     return  <Tooltip tooltipText={tooltip? tooltip:""} className={`flex relative size-full`}>


//             <h1 className={`flex text-accent font-text-bold tracking-wider text-lg py-2 transition-all ${editMode? "absolute pointer-events-none" : ""}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
//             {`${value == undefined? "[ Нижестоящее звание не указано ]" : value}`}
//             </h1>
            

//             {editable&&
//             <div className={`relative flex ${editMode? "" : "absolute opacity-0 pointer-events-none"}`} onClick={attemptToEdit} >
//                 <input value={value? value :""} type="text" onFocus={()=>{setIsFocused(true)}}  
//                 onChange={onChange} className={`flex ${editMode? "" : "absolute opacity-0 pointer-events-none"} inset-4 flex flex-1 text-accent font-text-bold tracking-wider text-lg resize-none py-2 bg-bg-primary transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}/>
//                     <div  className={`absolute flex font-text-bold p-2 gap-2 flex-col mt-2 z-1 top-full min-h-10 max-h-60 bg-bg-primary border border-border-secondary right-0 left-0 transition-all ${previousRankIsFocused? "" :"opacity-0 pointer-events-none"}`} style={{minHeight: `${previousRankIsFocused? "" :"0px"}`}}>
//                 {
//                 getRanks(rank.rankName!).map((item)=>(
//                     <div key={getRanks(rank.rankName!).findIndex(X=>X.rank == item.rank)} className="text-text-primary bg-bg-secondary px-4 hover:bg-accent hover:text-black transition-all" 
//                     onClick={()=>{
//                         setIsFocused(false)
//                         onChoice(post)
//                     }}
//                         >{`${item.rank? item.rank?.rankName : "[ Пусто ]"}`}</div>
//                 ))
//                 }
//                 </div>

                    

//                 </div>
//             }
//     </Tooltip>
// }
