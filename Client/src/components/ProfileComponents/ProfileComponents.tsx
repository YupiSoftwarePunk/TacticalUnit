interface IProfileBGImage{
    Url? : string
}
export const ProfileBGImage = ({Url} : IProfileBGImage)=>{
    return(
        <div className="flex size-full">

            <img src="#" alt="Profile background image" className="flex object-top object-cover self-center size-full text-white"/>
            <button className="absolute transform bg-bg-primary px-4 py-1 rounded-md transition-all hover:bg-bg-accent bottom-4 right-4">Заменить баннер</button>
        </div>
    )
}

interface IProfileSidePanelLink{
    Name : string,
    Url : string
}
interface IProfileSidePanel{
    imageUrl? : string,
    availableOptions? : IProfileSidePanelLink[],
    Unit? : IUnit
}
export const ProfileSidePanel = ({imageUrl, availableOptions, Unit} : IProfileSidePanel)=>{
    return(                
    <div className="flex border-r border-border-secondary">
        <div className="flex size-full">
            <div className="flex flex-col text-end gap-2">
                                    <div className="flex size-60 bg-black self-end relative">
                                        <img src="#" alt="Profile image" className="object-top object-cover self-center size-full text-white"/>
                                    </div>
                                    <ul className="flex flex-col gap-1 pr-4 items-end">
                                        {availableOptions&& availableOptions.map((item)=>(
                                            <a href={item.Url} key={availableOptions.indexOf(item)} className=" hover:text-accent transition-all">{item.Name}</a>
                                        ))}
                                    </ul>
                                </div>

                </div>
        </div>
    )
}
interface IUnitInfoPanel{
    Unit? : IUnit
}

export const UnitInfoPanel = ({Unit} : IUnitInfoPanel)=>{
    return(
        <div className="flex size-full flex-col gap-2">
                                            <div className="flex flex-col">
                                                <div className="flex justify-items-center gap-3">
                                                    <div className="bg-bg-dark size-8">
                                                        <img src="#" alt="" />
                                                    </div>
                                                    <p className="text-text-secondary self-center">Звание</p>
                                                </div>
                                                <p className="text-text-secondary-accent text-3xl">Никнейм</p>
                                            </div>
                                            <ul className="flex flex-col"> 
                                                <p>Должность 1</p>
                                                <p>Должность 2</p>
                                            </ul>
                                            <div className="flex flex-col">
                                                <ul className="flex gap-2">
                                                    <p className="flex ">Статус 1</p>
                                                    <p className="flex ">Статус 2</p>
                                                </ul>
                                            </div>
                                        </div>
    )
}