import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client';
import ReactPlayer from 'react-player';

const VideoCall = () => {
    let sc;
    const peer = useMemo( ()=> new RTCPeerConnection(
        {
            iceServers :[
                {
                    urls:[
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478"
                    ]
                }
            ],
        }
     
    ),[]);

    const [stream, setStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [newRemoteStream, setNewRemoteStream] = useState(null);
    const [remoteEmailId, setRemoteEmailId] = useState(null);

    const setRemoteAns = async(ans) => {
        await peer.setRemoteDescription(ans)
     } 

    const handleCallAccepted =useCallback(async(data)=>{
        const {ans} = data;
        await setRemoteAns(ans);
        sendStream(stream);
    },[setRemoteAns])

    const createOffer = async () =>{
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
      }
    const newUserJoined =  useCallback(async(data) =>{
        const {emailId} = data;
        const offer = await createOffer();
        sc.emit("call-user",{emailId,offer});
        setRemoteEmailId(emailId);

    },[createOffer,sc]);

    const createAnswer = async (offer) =>{
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer)
        return answer;
    };


    const handelIncomingCall =  useCallback(async(data) =>{
        const {from , offer} = data;
        const ans = await createAnswer(offer);
        sc.emit('call-accepted',{
            emailId:from,
            ans
        })
        setRemoteEmailId(from);
    },[createAnswer,sc]);


    

    const sendStream = async(stream) => {
        const tracks = stream.getTracks();
        for (const track of tracks) {
            peer.addTrack(track, stream);
        }
     }

     const handelTrackEvent = useCallback((ev)=>{
        const stream = ev.streams;
            setNewRemoteStream(stream[0])
    },[])

     const handeNegotation = useCallback(async()=>{
        const localOffer = peer.localDescription;
        sc.emit("call-user",{emailId: remoteEmailId,offer: localOffer});

    },[peer.localDescription, remoteEmailId, sc])

    const getUserMediaStream =useCallback(async(data)=>{
        const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
        setStream(stream);
    },[])

     
     
     useEffect(() => {
        sc = io('http://localhost:5000');

        sc.on("user-joined",newUserJoined);
        sc.on("incoming-call",handelIncomingCall);
        sc.on('call-accepted',handleCallAccepted);
        
        return () =>{
            sc.off('user-joined',newUserJoined);
            sc.off("incoming-call",handelIncomingCall)
            sc.off('call-accepted',handleCallAccepted)
        }
        // eslint-disable-next-line
      }, [handelIncomingCall,newUserJoined,sc,handleCallAccepted]);

      useEffect(()=>{
        getUserMediaStream();
      }, [getUserMediaStream]);
      useEffect(()=>{
        peer.addEventListener("track", handelTrackEvent);
        return ()=>{
            peer.removeEventListener("track", handelTrackEvent)
        }
    }, [peer, handelTrackEvent])
    useEffect(()=>{
        peer.addEventListener("negotiationneeded", handeNegotation);
        return ()=>{
            peer.removeEventListener("negotiationneeded", handeNegotation)
        }
      }, []);
    
  return (
    <div>
        <button onClick={()=>sendStream(stream)}>Send Video</button>
        <h1>{remoteEmailId}</h1>
         <ReactPlayer url={stream} playing/>
         <ReactPlayer url={newRemoteStream} playing/>
    </div>
  )
}

export default VideoCall