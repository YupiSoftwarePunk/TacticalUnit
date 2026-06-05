interface IBaseVar{
    dom : string
}


export function getBaseVariables() : IBaseVar
{
    let baseVars : IBaseVar = {
        dom : "http://localhost:6001"
    }
    return baseVars;
}