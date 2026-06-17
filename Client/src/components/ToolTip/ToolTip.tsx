import { useState } from "react";

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  innerClassName?: string;
  className_Tooltip?: string;
  tooltipText?: string;
  tooltipAlignment? : "left" | "center" | "right";
  verticalPlacement? : "top" | "bottom"
}
const Tooltip = ({children, tooltipText, className, innerClassName, className_Tooltip, tooltipAlignment = "left", verticalPlacement="bottom"}:CardProps) =>{
    const [showTooltip, setShowTooltip] = useState(false);
    return(
        <div className={`relative ${className!} ${tooltipAlignment == 'center'? "justify-center":""} flex`} onMouseOver={()=>{setShowTooltip(true)}} onMouseLeave={()=>{setShowTooltip(false)}}>
            
            <div className={`size-full ${innerClassName!}`}>{children}</div>
            {tooltipText &&
            <div className={`
                absolute text-text-primary font-text-bold ${verticalPlacement == "bottom" ? "top-full" : "bottom-full"} z-100 bg-bg-primary px-4 py-2 border border-border-secondary transition-all pointer-events-none ${showTooltip? "":"opacity-0"}
            ${tooltipAlignment == "left"? "left-0" : ""}
            ${tooltipAlignment == "right"? "right-0" : ""}
            ${tooltipAlignment == "center"? "self-center" : ""}
            `}  style={{marginTop: `${showTooltip && verticalPlacement == "bottom" ? "0px" : "20px" }`, marginBottom:  `${showTooltip && verticalPlacement == "top" ? "0px" : "20px" }`}}>
                <p className={`uppercase  ${className_Tooltip}`} >{tooltipText}</p>
            </div>
            }
        </div>
    )
}

export default Tooltip;