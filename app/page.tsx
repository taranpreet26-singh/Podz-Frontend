"use client";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { easeInOut, easeOut, motion } from "framer-motion"
import { v4 as uuid } from "uuid"
export default function Home() {
  const [room, setRoom] = useState<string>("");
  const [isOpenSuggestion, setOpenSuggestion] = useState<boolean>(false)
  const navigate = useRouter();
  const listArr = [
    "Start meeting",
    "Create meeting for later"
  ]


  function handleMeeting() {
    setOpenSuggestion(false)
    
    

    if (room.trim() !== "") {
      navigate.push(`/room/${room}`);
    } else {
      toast.error("Please provide a room name.");
    }
  }

  function handleListTypeMeeting(index: number) {
    if (index === 0) {
      handleMeeting()
    } else if (index === 1) {
      setRoom(uuid())
    }
  }

  return (
    <div className="w-full min-h-screen overflow-hidden relative bg-black text-white flex flex-col">
      <motion.nav
        initial={{ y: -100 ,opacity:0}}
        animate={{y:0,opacity:1}}
        transition={{duration:0.5,ease:easeInOut}}
        className="bg-black/70 w-full p-6 z-[4] relative">
        <h1 className="text-5xl font-extrabold text-shadow-2xs text-shadow-indigo-200">
          Podz
        </h1>
      </motion.nav>

      <main className="flex-1 flex flex-col justify-center items-center text-center px-6 lg:px-0 z-[2] relative">
        <div className="max-w-4xl w-full flex flex-col items-center gap-2 mt-10">
          <motion.h1 
          initial={{opacity:0,x:-10}}
          animate={{opacity:1,x:0}}
          transition={{duration:0.5,ease:easeInOut,delay:0.6}}
          className="text-4xl lg:text-6xl font-bold leading-snug text-shadow-2xs text-shadow-white">
            Video calls
          </motion.h1>
          <motion.h1 
           initial={{opacity:0,x:10}}
          animate={{opacity:1,x:0}}
          transition={{duration:0.5,ease:easeInOut,delay:0.9}}
          className="text-4xl lg:text-6xl font-bold leading-snug text-shadow-2xs text-shadow-white">
            and meetings
          </motion.h1>
          <motion.h1 
           initial={{opacity:0,x:-10}}
          animate={{opacity:1,x:0}}
          transition={{duration:0.5,ease:easeInOut,delay:1}}
          className="text-4xl lg:text-6xl font-bold leading-snug text-shadow-2xs text-shadow-white">
            for everyone
          </motion.h1>

          <motion.p 
          initial={{y:10,opacity:0}}
          animate={{y:0,opacity:1}}
           transition={{duration:0.5,ease:easeInOut,delay:1.2}}
          className="text-lg lg:text-xl text-gray-300 mt-4">
            Connect, collaborate, and celebrate from anywhere with Podz.
          </motion.p>

          <div
            className="flex flex-col-reverse relative lg:flex-row items-center justify-center gap-4 w-full mt-6"

          >
            {
              isOpenSuggestion &&
              <motion.div initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: easeOut }}
                className="bg-white p-6 rounded-2xl top-[125px] lg:left-40 lg:top-[56px]  z-20 font-bold text-black w-fit absolute">
                <ul>
                  {
                    listArr.map((element, index) => {
                      return <motion.li className="cursor-pointer" onClick={() => { handleListTypeMeeting(index); }} whileHover={{ scale: "1.1" }} key={index}  >
                        {element}
                      </motion.li>
                    })
                  }
                </ul>
              </motion.div>

            }

            <div onClick={() => { setOpenSuggestion(true); }} className="cursor-pointer">
              <Button>New Meeting</Button>
            </div>
            <div
              className="w-full lg:w-1/2"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                id="room"
                value={room}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRoom(e.target.value)
                }
                placeholder="e.g., design-meet"
                className="w-full p-3 rounded-lg border border-gray-600 bg-white/5 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-white/60 transition duration-300"
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-sm text-gray-400 relative z-[2]">
        Backend deployed on Render — may take up to a minute to wake up.
      </footer>

      <div className="absolute -bottom-10 left-0 w-56 h-56 blur-[150px] bg-purple-500 drop-shadow-2xl" />

      <div className="absolute z-[1] overflow-hidden -top-0 -right-70 rotate-[60deg] scale-125">
        <Image
          src={"/images/right-rope.webp"}
          width={1000}
          height={1000}
          alt="rope"
          className="w-full h-full"
        />
      </div>
      <div className="absolute z-[1] overflow-hidden -top-0 -left-100 rotate-[-20deg] scale-125">
        <Image
          src={"/images/right-rope.webp"}
          width={1000}
          height={1000}
          alt="rope"
          className="w-full h-full"
        />
      </div>

      <Toaster position="top-right" />
    </div>
  );
}
