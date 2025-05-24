export default function Button({children}:{children:React.ReactNode}){
    return <div className=" p-[2px]  w-fit h-14  relative bg-black  overflow-hidden    rounded-full">
            <div className="absolute top-[-300%] left-[-70%] button-wrapper   w-[400px]   rounded-full h-[400px]">

            </div>
        <div className="button-content gap-2 flex items-center justify-center text-white text-shadow-2xs text-shadow-white bg-black relative z-10 w-fit p-6 h-full rounded-full ">
                {children}
        </div>
    </div>
}