"use client"
import Button from "@/components/ui/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";



export default function Home() {
  const [room,setRoom] = useState<string>("")
  const navigate = useRouter()
  useEffect(()=>{
    document.body.style.overflow ="hidden"

    return ()=>{
      document.body.style.overflow ="block"

    }
  },[])
  function handleMeeting(){
    if(room !== ""){
      navigate.push(`/room/${room}`)
    }else{
      toast.error('Please Provide Room')
    }
  }
  return <div className="w-full h-[100vh] overflow-hidden  pt-6 px-6 lg:px-10 "  style={{background:"url('/images/ring-light.webp')",backgroundSize:"cover",backgroundRepeat:"no-repeat"}}>
    <nav className="">
      <h1 className="text-5xl text-shadow-2xs text-shadow-indigo-200">Podz</h1>
    </nav>

    <main className="flex w-[60%] py-30   h-full ">
      <div className="">
        <h1 className="text-3xl pr-10 lg:text-5xl  font-bold text-shadow-2xs text-shadow-white ">Video calls and meeting for everyone</h1>
        <p className="text-2xl mt-8   font-semibold">Connect,collaborate and celebrate from anywhere with Podz</p>
        <div className="flex flex-col-reverse lg:flex-row cursor-pointer gap-2 lg:gap-10 mt-8" onClick={handleMeeting}>
            <Button>
              New Meeting
            </Button>
          <div onClick={(e)=>{e.stopPropagation()}} className="w-full lg:w-1/2 h-full">
          <input
            type="text"
            id="room"
            value={room}
            onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{setRoom(e.target.value)}}
            placeholder="e.g., design-meet"
            className="w-full p-3 rounded-lg border border-gray-600 bg-white/5 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-white/60 transition duration-300"
            />
            </div>
        </div>
      </div>
      <div>
      </div>
    </main>
    <div className="absolute -bottom-10 left-0 w-56 drop-shadow-2xl  h-56 blur-[150px] bg-purple-500 ">
    </div>
    <div className="absolute z-[-1] overflow-hidden -top-20 right-0 rotate-[20deg] scale-125">
      <Image src={'/images/right-rope.webp'} width={1000} height={1000} alt="rope" className="w-full h-full"/>
    </div>
    <Toaster position="top-right"/>
  </div>
}