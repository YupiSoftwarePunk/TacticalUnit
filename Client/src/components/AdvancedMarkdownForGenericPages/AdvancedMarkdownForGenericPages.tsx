import { ChangeEvent, CSSProperties, Dispatch, SetStateAction, useState } from "react"
import Tooltip from "../ToolTip/ToolTip"
import { ScrollBehavior } from "next/dist/client/components/router-reducer/router-reducer-types"
import TextareaAutosize from "react-textarea-autosize";
import ToolTip from "../ToolTip/ToolTip";
import { Check, ChevronDown } from "lucide-react";

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
    tooltip? : string,
    type? : "text" | "num",
    watermark? : string,
    maxLength? : number
}

export const MultiroleInputField = ({className = "", editingClassName = "", editable, onClick, onChange, value, editMode, tooltip, type="text", watermark, maxLength} : IMultiroleInputField) =>{
    //const [editMode, setEditMode] = useState<boolean>();
    const [filling, setFilling] = useState<boolean>(`${value}`.length != 0)

    function changeSequence(e : ChangeEvent<HTMLInputElement, HTMLInputElement>){
        
        setFilling(`${e.target.value}`.length != 0)

        if(maxLength){
            if (e.target.value.length <= maxLength) onChange!(e)
            
        }
        else{
            onChange!(e);
        }
        return e;
    }

    return  <Tooltip className_Tooltip="text-[16px]" tooltipText={tooltip? tooltip:""} className={`flex relative size-full`}>
        <div className="flex flex-1 gap-5" onClick={onClick}>
            <div className={`flex text-accent font-text-bold uppercase tracking-wider text-lg py-2 transition-all ${className} ${editMode? "absolute pointer-events-none" : ""}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
                <h1 className={`flex text-accent font-text-bold uppercase tracking-wider text-lg transition-all ${editMode? "opacity-0" : ""}`} >
                {`${value}`}
                </h1>
                </div>
                {editable &&
                type == "text" &&
                <div className={`flex relative flex-col ${editingClassName} ${editMode? "" : "absolute opacity-0 pointer-events-none size-full"} flex-1 transition-all`}>
                    <input value={value} type="text" onChange={changeSequence} className={`flex ${editMode? "" : " opacity-0 pointer-events-none"} inset-4 flex flex-1 text-accent font-text-bold uppercase tracking-wider text-lg resize-none py-2 bg-bg-primary transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}/>
                    {watermark&& <p className={`absolute size-full content-center px-3 pointer-events-none text-t ext-primary  transition-all`} style={{opacity: `${filling? "0" : "0.5"}`}}>{watermark}</p>}
                </div>
                }
                {editable &&
                type == "num" &&
                <div className={`flex flex-col ${editingClassName} ${editMode? "" : "absolute opacity-0 pointer-events-none size-full"} flex-1 transition-all`}>
                    <input value={value} type="number" onChange={changeSequence} className={`flex ${editMode? "" : " opacity-0 pointer-events-none"} inset-4 flex flex-1 text-accent font-text-bold uppercase tracking-wider text-lg resize-none py-2 bg-bg-primary transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}/>
                
                </div>
                }
        </div>
    </Tooltip>
}

interface IColorInputField{
    className? : string
    editingClassName? : string
    editable? : boolean
    editMode? : boolean
    onClick? : () => void
    onChange? : (e : ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) => void
    value? : string | number
    tooltip? : string,
    type? : "text" | "num",
    watermark? : string,
    maxLength? : number
}
export const ColorInputField = ({editable, onClick, onChange, value, editMode} : IColorInputField) =>{
    //const [editMode, setEditMode] = useState<boolean>();
    // const [filling, setFilling] = useState<boolean>(`${value}`.length != 0)

    return  <Tooltip tooltipText="Поле цвета в формате HEX" className="flex flex-col self-stretch size-full">
            <div className="flex relative border border-border-secondary min-w-10 h-full"  onClick={onClick} style={{cursor: `${editable? "pointer" : "auto"}`, background: `${value}`}}>
                <h1 className={`flex text-text-primary text-shadow-lg  text-shadow-text-inverted font-text-bold tracking-wider text-lg inset-2 transition-all m-2 ${editMode? "absolute pointer-events-none opacity-0" : " opacity-50"}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
                {`${value}`}
                </h1>
                {editable&&
                <textarea value={value} onChange={(e)=>{e.target.value.length <=7? onChange!(e)! : e.target.value}} className={`${editMode? "" : "absolute opacity-0 pointer-events-none"} inset-2 flex flex-1 w-fit text-text-primary text-shadow-lg text-shadow-text-inverted font-text-bold text-lg resize-none py-2 transition-all`} style={{padding: `${editMode? "24" : "0"}px`}} rows={1} cols={7}/>}
            </div>
        </Tooltip>
}

interface IDescriptionInputField{
    className? : string
    editingClassName? : string
    editable? : boolean
    editMode? : boolean
    onClick? : () => void
    onChange? : (e : ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) => void
    value? : string | number
    tooltip? : string
    watermark? : string
}

export const DescriptionInputField = ({className = "", editingClassName = "", editable, onClick, onChange, value = "", editMode, tooltip,watermark} : IDescriptionInputField) =>{
    //const [editMode, setEditMode] = useState<boolean>();
    const [filling, setFilling] = useState<boolean>(`${value}`.length != 0)
    const [rows, setRows] = useState<number>()
    const textSize = 16;
    
    return  <Tooltip tooltipText={tooltip? tooltip:""} className={`flex relative size-full`}>
        <div className="flex flex-1 gap-5" onClick={onClick}>
            <div className={`flex text-text-secondary font-text-bold tracking-wider  text-[${textSize}px] py-2 transition-all ${className} ${editMode? "absolute pointer-events-none" : ""}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
                <p className={`flex tracking-wider transition-all  ${editMode? "opacity-0" : ""}`} >
                {`${value? value : "[ описание пусто ]"}`}
                </p>
                </div>
                {editable &&
                <div className={`flex relative  ${editingClassName} ${editMode? "" : "absolute opacity-0 pointer-events-none size-full"} flex-1 transition-all`}>
                    <TextareaAutosize minRows={3} value={value} onChange={(e)=>{onChange!(e); setFilling(`${e.target.value}`.length != 0)}} className={`flex ${editMode? "" : " opacity-0 pointer-events-none"} inset-x-4  flex flex-1  tracking-wider  py-2 bg-bg-primary transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}/>
                    {watermark&& <p className={`absolute size-full px-3 py-2 pointer-events-none ext-primary  transition-all`} style={{opacity: `${filling? "0" : "0.5"}`}}>{watermark}</p>}
                </div>
                }
        </div>
    </Tooltip>
}

export interface IListedInputItem{
    Id? : number,
    Name? : string
}
interface IListedInputField{
    className? : string
    editingClassName? : string
    editable? : boolean
    editMode? : boolean
    onClick? : () => void
    onChange? : (e : ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
    onChoice? : (chosenElement : IListedInputItem) => void
    value? : string | number
    list? : IListedInputItem[]
    style? : CSSProperties
    tooltip? : string
    watermark? : string

}

export function ListedInputField({className, editingClassName, editable, onClick, onChange, value, editMode, list = [], style, tooltip, onChoice} : IListedInputField){
    //const [editMode, setEditMode] = useState<boolean>();
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isOverMenu, setIsOverMenu] = useState<boolean>(false);
    return  <Tooltip verticalPlacement="top" className_Tooltip="text-[16px]" tooltipText={tooltip? tooltip:""} className={`flex relative size-full`}>


            <h1 className={`flex text-accent font-text-bold tracking-wider text-lg py-2 transition-all ${editMode? "absolute pointer-events-none" : ""}`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
            {`${value == undefined? "[ Нижестоящее звание не указано ]" : value}`}
            </h1>
            

            {editable&&
            <div className={`relative flex ${editMode? "" : "absolute opacity-0 pointer-events-none"}`} onClick={onClick} >
                <input value={value? value :""} type="text"  onFocus={()=>{setIsFocused(true)}} onBlur={()=>{setIsFocused(false)}}  
                onChange={onChange}  className={`flex ${editMode? "" : "absolute opacity-0 pointer-events-none"} inset-4 flex flex-1 text-accent font-text-bold tracking-wider text-lg resize-none py-2 bg-bg-primary transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}/>
                    <div onMouseEnter={()=>{setIsOverMenu(true)}} onMouseLeave={()=>{setIsOverMenu(false)}} className={`cursor-pointer absolute flex font-text-bold p-2 gap-2 flex-col mt-2 z-1 top-full min-h-10 max-h-60 bg-bg-primary border border-border-secondary right-0 left-0 transition-all ${isFocused || isOverMenu ? "" :"opacity-0 pointer-events-none"}`} style={{minHeight: `${isFocused || isOverMenu? "" :"0px"}`}}>
                {
                list.map((item)=>(
                    <div key={list.findIndex(x=>x.Id == item.Id)} className="text-text-primary bg-bg-secondary px-4 hover:bg-accent hover:text-black transition-all" 
                    onClick={()=>{
                    setIsFocused(false)
                    setIsOverMenu(false)
                    onChoice!(item)
                    }}
            >{`${item.Name? item.Name : "[ Пусто ]"}`}</div>
                ))
                }
                </div>

                    

                </div>
            }
    </Tooltip>
}


interface IPermissionRollDownList{
    editable? : boolean
    editMode? : boolean
    onChange? : (newPermissionList : IGivedPermission[]) => void
    setPermissionsMethod? : Dispatch<SetStateAction<IGivedPermission[]>>
    value? : string | number
    allPermissionsList? : IGivedPermission[]
    givedPermissionList : IGivedPermission[]

}
export const PermissionRollDownList = ({setPermissionsMethod, editable, editMode, onChange, allPermissionsList, givedPermissionList} : IPermissionRollDownList) =>{
    const [permissionsExtended, setPermissionExtended] = useState(false);
    
    function setPermission(PermissionId : number) : IGivedPermission[]{
        let midList :IGivedPermission[] = [...[], ...givedPermissionList];

        if(givedPermissionList.find(x=>x.Id == PermissionId)){
            // console.warn("unSet")
            givedPermissionList.find(x=>x.Id == PermissionId)!.Inherit = false;
            midList = midList.filter(x=>x.Id != PermissionId);
            //return midList.filter(x=>x.Id != PermissionId)
        }else if (allPermissionsList){
            // console.warn("Set")
            midList.push(allPermissionsList?.find(x=>x.Id == PermissionId)!)
            
            //return midList;
        }
        onChange?onChange(midList):false;
        return midList;
    }
    function setInherit(PermissionId : number) : IGivedPermission[]{
        let modList : IGivedPermission[] = [...[], ...givedPermissionList];
        if(modList.find(x=>x.Id == PermissionId)){
            modList.find(x=>x.Id == PermissionId)!.Inherit = !modList.find(x=>x.Id == PermissionId)!.Inherit;
            
        }else{
            modList = setPermission(PermissionId);
            modList.find(x=>x.Id == PermissionId)!.Inherit = !modList.find(x=>x.Id == PermissionId)!.Inherit;
            //modList.push(prompt);
        }
        onChange?onChange(modList):false;
        return modList;
    }
    
    return(
        <div className="flex flex-col size-full relative  group pointer-events-auto" >
                                <div className="flex justify-between text-accent hover:bg-bg-accent transition-all cursor-pointer" onClick={()=>{setPermissionExtended(!permissionsExtended)}}>

                                    <h1 className={`flex font-text-bold tracking-wider text-lg py-2 transition-all`} style={{paddingLeft: `${editMode? "12" : "0"}px`}}>
                                    {`Разрешения`}
                                    </h1>
                                    <ChevronDown className="self-center transition-all" style={{rotate: `${permissionsExtended? "180" : "0"}deg`}}></ChevronDown>
                                </div>
        <div className={`relative flex min-h-0 transition-all ${permissionsExtended? "" : "h-0  overflow-clip pointer-events-none"}`} > {/* onClick={attemptToEdit}  */}
            <div  className={`flex flex-1  font-text-bold min-h-0 p-2 gap-2 flex-col mt-2 z-1 top-full  max-h-60 bg-bg-primary border border-border-secondary right-0 left-0 transition-all ${permissionsExtended? "" :"h-0 pointer-events-none"}`} style={{minHeight: `${permissionsExtended? "" :"0px"}`}}>
                {!editable && givedPermissionList && 
                    givedPermissionList!.map((item)=>(
                    <div key={item.Permission.Name} className="flex">
                        <p className="hover:bg-bg-secondary gap-3 flex flex-1">{item.Permission.Name}</p>
                    </div>
                ))
                }
                {editable && allPermissionsList &&
                allPermissionsList!.map((item)=>(
                    <div key={item.Permission.Name} className="flex">
                        
                        <button className="hover:bg-bg-secondary gap-3 flex flex-1 ">
                            <ToolTip tooltipText="Выдать разрешение" className="flex" className_Tooltip="text-[16px]">
                                <div className="bg-bg-dark border border-border-secondary cursor-pointer hover:text-accent"  onClick={()=>{setPermission(item.Id!)}}> <Check className={`${givedPermissionList.find(x=>x.Id == item.Id)? "opacity-100" : "opacity-0"} transition-all`}></Check></div>
                            </ToolTip>
                            <ToolTip tooltipText="Наследовать разраешение" className_Tooltip="text-[16px]">
                                <div className="bg-bg-dark border border-border-secondary cursor-pointer hover:text-accent"  onClick={()=>{setInherit(item.Id!)}}> <Check className={`${givedPermissionList.find(x=>x.Id == item.Id)?.Inherit? "opacity-100" : "opacity-0"} transition-all`}></Check></div>
                            </ToolTip>
                            <ToolTip className="flex flex-1" innerClassName="flex" tooltipAlignment="left" className_Tooltip="max-w-100 text-[14px]" tooltipText={`${item.Permission.Description}`}>

                                <p className="text-text-primary font-text-bold">{item.Permission.Name}</p>
                            </ToolTip>
                        </button>
                        
                    </div>
                ))
                }
            </div>

            

            </div>
            </div>
    )
}