import { useState } from "react";

export interface IContainedInfo{
    content: string;
    color: string;
}

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  innerClassName?: string;
  className_Tooltip?: string;
  containedInfoList? : IContainedInfo[];
  tooltipAlignment? : "left" | "center" | "right";
  verticalPlacement? : "top" | "bottom"
}
const InfoContainer = ({children, containedInfoList, className, innerClassName, className_Tooltip, tooltipAlignment = "center", verticalPlacement="bottom" }:CardProps) =>{
    const [showTooltip, setShowTooltip] = useState(false);
    return(
        <div className={`relative focus:border-4  ${className!} flex ${tooltipAlignment == 'center'? "justify-center":""}`} onMouseOver={()=>{setShowTooltip(true)}} onMouseLeave={()=>{setShowTooltip(false)}}>
            
            <div className={`size-full ${innerClassName!}`}>{children}</div>
            {containedInfoList && containedInfoList.length > 0 &&
            <div className={`
                absolute flex flex-col text-text-primary font-text-bold ${verticalPlacement == "bottom" ? "top-full" : "bottom-full"} z-100 bg-bg-primary px-4 py-2 border border-border-secondary transition-all pointer-events-none ${showTooltip? "":"opacity-0"}
            ${tooltipAlignment == "left"? "left-0" : ""}
            ${tooltipAlignment == "right"? "right-0" : ""}
            `}  style={{marginTop: `${showTooltip? "0px" : "20px"}`}}>
                {
                    containedInfoList.map((item)=>(
                        <div className="flex overflow-visible bg-bg-secondary px-4 text-lg" key={containedInfoList.indexOf(item)}>
                            {item.content}
                        </div>
                    ))
                }
            </div>
            }
        </div>
    )
}

export default InfoContainer;