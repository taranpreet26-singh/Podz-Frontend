"use client"
import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Mic, MicOff, MonitorUp, ScreenShareOff, X } from 'lucide-react';
import Button from "@/components/ui/Button";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";


export default function Home() {
  const localUserRef = useRef<RTCPeerConnection>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteUserVideoRef = useRef<HTMLVideoElement>(null)
  const pendingCandidateRef = useRef<RTCIceCandidate[]>([])
  const [screenStatus, setScreenStatus] = useState<boolean>(true)
  const [audioStatus, setAudioStatus] = useState<boolean>(true)
  const [overlayStatus, setOverlayStatus] = useState<boolean>(true)
  const [screenDsiplayShare, setScreenShareStatus] = useState<boolean>(true)
  const [currentRoom, setRoom] = useState<string>("")
  const myVideoRef = useRef<HTMLVideoElement>(null)
  const screenDisplayRef = useRef<HTMLVideoElement>(null)
  const { room } = useParams()
  // const URL = "ws://localhost:8888"

  useEffect(() => {
    if (room) {
      setRoom(room[0])

      console.log(room[0])
      const socket = new WebSocket("wss://podz-server.onrender.com")
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" }
        ]
      });
      localUserRef.current = pc
      socket.onopen = () => {
        console.log("onopen")
        socket.send(JSON.stringify({
          type: "join",
          room: room[0]
        }))
      }

      pc.onnegotiationneeded = async () => {
        try {
          const offer = await pc.createOffer()
          await pc.setLocalDescription(offer)
          socket.send(JSON.stringify({
            type: "offer",
            offer: offer,
            room: room[0]
          }))
        } catch (error) {
          console.log(error)
        }
      }

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.send(JSON.stringify({
            type: "candidate",
            candidate: event.candidate,
            room: room[0]
          }))
        }
      }
      pc.ontrack = (event) => {
        console.log(event)
        if (event.streams && remoteUserVideoRef.current) {
          remoteUserVideoRef.current.srcObject = event.streams[0]
        }
      }
      socket.onmessage = async (event) => {
        const message = JSON.parse(event.data)
        console.log(message)
        if (message.type === "offer") {
          if (pc.signalingState === "stable" || pc.signalingState === "have-local-offer")
            await pc.setRemoteDescription(message.offer)
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          socket.send(JSON.stringify({
            type: "answer",
            answer: answer,
            room: room[0]
          }))
          while (pendingCandidateRef.current.length > 0) {
            const candidate = pendingCandidateRef.current.shift()
            if (candidate) {
              await pc.addIceCandidate(candidate)
            }
          }
        } else if (message.type === "answer") {
          console.log(">>>>>>>>>>>>>>>>>answer", message)
          await pc.setRemoteDescription(message.answer)
          while (pendingCandidateRef.current.length > 0) {
            const candidate = pendingCandidateRef.current.shift()
            if (candidate) {
              await pc.addIceCandidate(candidate)
            }
          }
        } else if (message.type === "candidate") {
          console.log(message)
          const iceCandidate = new RTCIceCandidate(message.candidate)
          if (pc.remoteDescription) {
            await pc.addIceCandidate(iceCandidate)
          } else {
            pendingCandidateRef.current.push(iceCandidate)
          }

        }

      }
    }
    handleMyVideo()
  }, [room])

  function handleAudio() {
    if (localVideoRef.current) {
      if (audioStatus) {

        setAudioStatus(false)
        const stream = localVideoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => {
          if (track.kind === "audio") {
            track.enabled = false
          }
        })
      } else {
        sendingVideo()
        setAudioStatus(true)
      }
    }
  }

  function handleScreenPlay() {
    if (localVideoRef.current) {
      const stream = localVideoRef.current.srcObject as MediaStream
      if (screenStatus) {
        stream.getTracks().forEach((track) => {
          console.log(">>>>>>>>>>>>>.track", track)
          if (track.kind === "video") {
            track.enabled = false
          }
        })
        localVideoRef.current.srcObject = null
        setScreenStatus(false)
      } else {
        setScreenStatus(true)
        sendingVideo()
      }
    }
  }

  async function sendingVideo() {
    setAudioStatus(true)
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
         facingMode: "user",
        width: { ideal: 3840 },
        height: { ideal: 2160 },
        frameRate: { ideal: 60 }
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount:1
      }
    });
    stream.getTracks().forEach(track => {
      localUserRef.current?.addTrack(track, stream)
      
    })
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream
    localVideoRef.current.muted = true; 
    }
  }


  function handleStartMeeting() {
    setOverlayStatus(false)
    sendingVideo()
    toast.success("You're Meeting is begin")
  }

  function handleOverlayClose() {
    if (currentRoom !== "") {
      setOverlayStatus(false)
    } else {
      toast.error("Provide Room Name")
    }
  }

  async function handleMyVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 3840 },
        height: { ideal: 2160 },
        frameRate: { ideal: 60 }
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount:1
      }
    });

    if (myVideoRef.current) {
      myVideoRef.current.srcObject = stream;
      myVideoRef.current.muted = true; 
    }
  }

  async function handleScreenShare(){
    if(screenDsiplayShare){

      const screenShareStream = await window.navigator.mediaDevices.getDisplayMedia({
        video:true,
        audio:true
      })
      
      const audioStream = await window.navigator.mediaDevices.getUserMedia({
        audio:true
      })

      const combinedStream = new MediaStream([...screenShareStream.getVideoTracks(),...audioStream.getAudioTracks()])
      
      if(screenDisplayRef.current){
        screenDisplayRef.current.srcObject = combinedStream
      } 
      screenShareStream.getTracks().forEach(track=>{
        localUserRef.current?.addTrack(track,combinedStream)
      })
      setScreenShareStatus(false)
    }else{
      sendingVideo()
      setScreenShareStatus(true)
    }
  }

  return (
    <div className="w-full  min-h-screen  overflow-hidden">
      <div className="w-full   h-full">
        <div className={`w-[16vw] aspect-square absolute  bottom-5  right-5 z-[1]  `}>
          <video ref={localVideoRef} playsInline  autoPlay muted className="w-full h-full rounded-full shadow-lg shadow-emerald-200/40 transition-all duration-300 object-cover border-green-200 border-2"></video>
        </div>
        <div className="w-full h-[100vh] p-4 lg:p-2 z-[-1] ">
          <video ref={remoteUserVideoRef} playsInline  autoPlay className="w-full h-full  rounded-2xl object-contain border-blue-200 drop-shadow-2xl shadow-blue-400/40 shadow-lg transition-all duration-300 border-2"></video>
        </div>
       
      </div>
      <div className="w-full absolute bottom-0 flex  items-center  justify-center">
        <div className="px-4 card-wrapper overflow-hidden  relative bg-gradient-to-b from-slate-700 to-slate-800  rounded-full  p-[1px] ">
          <div className="w-full card-content p-2  h-full bg-black rounded-full   items-center justify-center gap-6   flex">
            <div className="flex max-w-fit    items-center justify-center " onClick={handleScreenPlay}>
              {
                screenStatus ? <Camera width={50} height={50} color="black" className="bg-white shadow-2xl  rounded-full p-3  backdrop-blur-2xl" /> :
                  <CameraOff width={50} height={50} color="black" className="bg-white shadow-2xl  rounded-full p-3  backdrop-blur-2xl" />
              }
            </div>
            <div className="flex max-w-fit    items-center justify-center " onClick={handleAudio}>
              {
                audioStatus ? <Mic width={50} height={50} color="black" className="bg-white shadow-2xl  rounded-full p-3  backdrop-blur-2xl" /> :
                  <MicOff width={50} height={50} color="black" className="bg-white shadow-2xl  rounded-full p-3  backdrop-blur-2xl" />
              }
            </div>
            <div className="flex max-w-fit    items-center justify-center " onClick={handleScreenShare}>
              {
                screenDsiplayShare ? <MonitorUp width={50} height={50} color="black" className="bg-white shadow-2xl  rounded-full p-3  backdrop-blur-2xl" /> :
                  <ScreenShareOff width={50} height={50} color="black" className="bg-white shadow-2xl  rounded-full p-3  backdrop-blur-2xl" />
              }
            </div>
          </div>
        </div>
      </div>
      {
        overlayStatus &&
        <div className="w-full h-screen flex items-center  justify-center  absolute inset-0 z-40 " onClick={handleOverlayClose}>
          <div onClick={(e) => { e.stopPropagation() }} className="w-[80vw] h-[80vh] relative   flex items-center rounded-4xl  justify-center">
            <div className="relative group bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-2xl w-full max-w-md border border-white/20 shadow-2xl backdrop-blur-sm transition-transform transform hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] duration-300 ease-in-out overflow-hidden">

              <div className="absolute -inset-0.5 bg-gradient-to-tr from-white/10 via-white/30 to-white/10 rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-500 pointer-events-none"></div>

              <h2 className="text-3xl font-bold mb-8 text-center tracking-wide">🎥 Join a Video Room</h2>

              <div className="mb-6">
                <h1 className="text-xl">{currentRoom}</h1>
              </div>
              <div className="flex flex-col gap-6 items-center justify-center" onClick={handleStartMeeting}>
                <video ref={myVideoRef} autoPlay className="w-full h-[40vh]  rounded-2xl shadow-lg shadow-emerald-200/40 transition-all duration-300 object-cover border-green-200 border-2"></video>
                <div className="cursor-pointer">
                  <Button>
                    Start Meeting
                  </Button>
                </div>
              </div>
              <div onClick={handleOverlayClose} className="absolute top-4 right-3 hover:rotate-90 transition-all duration-800 ease-in-out">
                <X width={30} height={30} />
              </div>
            </div>

          </div>
        </div>
      }
      <div className="absolute -bottom-10 left-0 w-56 drop-shadow-2xl  h-56 blur-[200px] bg-white ">
      </div>
      <div className="absolute -top-10 right-0 w-56 drop-shadow-2xl  h-56 blur-[200px] bg-purple-500 ">
      </div>
     
      <Toaster position="top-right" />
    </div>
  );
}
