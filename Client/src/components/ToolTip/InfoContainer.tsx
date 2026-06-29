import { useState } from "react";


interface CardProps {
    children?: React.ReactNode;
    className?: string;
    innerClassName?: string;
    className_Tooltip?: string;
    containedInfoList? : IContainedInfo[];
    tooltipAlignment? : "left" | "center" | "right";
    verticalPlacement? : "top" | "bottom",
    appearOn? : "hover" | "click"
}
const InfoContainer = ({children, containedInfoList, className, innerClassName, className_Tooltip, appearOn = "hover", tooltipAlignment = "center", verticalPlacement="bottom" }:CardProps) =>{
    let [mouseOverContent, setMouseOverContent] = useState(false);
    let [mouseOverInfo, setMouseOverInfo] = useState(false);
    const [catchEvents, setCatchEvents] = useState(false);
    const [focused, setFocused] = useState(false);
    return(
        <div className={`relative focus:border-4  ${className!} flex ${tooltipAlignment == 'center'? "justify-center":""}`}  
        onMouseOver={()=>{setMouseOverContent(true); setCatchEvents(true)}} 
        onMouseLeave={()=>{setMouseOverContent(false); mouseOverContent = false; 
            if(!mouseOverInfo) {setFocused(false); setCatchEvents(false)}}}>
            
            <div className={`size-full ${innerClassName!}`} onClick={()=>{setFocused(!focused); setCatchEvents(!focused)}}>{children}</div>
            {containedInfoList && containedInfoList.length > 0 &&
            <div 
            onMouseEnter={()=>{setMouseOverInfo(true); setCatchEvents(true)}} 
            onMouseLeave={()=>{setMouseOverInfo(false);  mouseOverInfo = false;
                
                if(!mouseOverContent) {setFocused(false); setCatchEvents(false)}}
            } 
            
            className={`
                absolute flex flex-col text-text-primary font-text-bold max-h-45 overflow-y-scroll gap-1 ${verticalPlacement == "bottom" ? "top-full" : "bottom-full"} z-100 bg-bg-primary px-4 py-2 border w-80 border-border-secondary transition-all ${catchEvents? "pointer-events-auto" : "pointer-events-none"}  ${appearOn == "hover" ? ((mouseOverContent || mouseOverInfo)? "opacity-100 pointer-events-auto" : "opacity-0") : ((mouseOverContent || mouseOverInfo) && focused? "opacity-100" : "opacity-0")}
            ${tooltipAlignment == "left"? "left-0" : ""}
            ${tooltipAlignment == "right"? "right-0" : ""}
            `}  style={{marginTop: `${appearOn == "hover" ? ((mouseOverContent || mouseOverInfo)? "0px" : "20px") : ((mouseOverContent|| mouseOverInfo) && focused? "0px" : "20px")}`}}>
                {
                    containedInfoList.map((item)=>(
                        <div className="flex flex-col bg-bg-secondary hover:bg-bg-primary px-4 " key={containedInfoList.indexOf(item)}>
                            <div className="flex overflow-visible  size-full   transition-all" >

                            {item.color && 
                            <div className="rounded-full min-h-3 min-w-3 self-center mx-2"  style={{background: `${item.color}`}}></div>}
                            {item.content}
                            </div>
                            <div className="flex justify-between">
                                {item.id != undefined &&
                                <div className="flex text-text-secondary hover:text-text-secondary-accent hover:underline cursor-copy transition-all" onClick={()=>{navigator.clipboard.writeText(item.id!)}}>ID: {item.id}</div>
                                }
                                {item.dates != undefined &&
                                <div>|</div> &&
                                <div className="flex text-text-secondary">{item.dates}</div>
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
            }
        </div>
    )
}

export default InfoContainer;