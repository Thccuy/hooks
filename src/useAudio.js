import {useEffect, useRef, useState} from "react";
import useInitial from "../../utils/hooks/useInitial";

function useAudio(
    src,

    onNoSrc = () => {},
) {
    const [currentTime,setCurrentTime] = useState(0)
    const [duration,setDuration] = useState(0)
    // const [duration,setDuration] = useState(0)

    const audio = useRef(null)
    const onTimeUpdate = () => {
        setCurrentTime(audio.current.currentTime)
    }
    const changeCurrentTime = (time) => {
        audio.current.currentTime = time
    }
    const changeCurrentTimeRef = useRef(changeCurrentTime)
    const onTimeUpdateRef = useRef(onTimeUpdate)


    useInitial(() => {
        audio.current = new Audio(src)
        audio.current.addEventListener("timeupdate",onTimeUpdateRef.current)
    })

    const play = () => {
        audio.current.play()
            .then(() => {
                setDuration(audio.current.duration)
            })
            .catch((err) => {
                if(err === "DOMException: The element has no supported sources.") {
                    onNoSrc()
                }
            })
    }

    const pause = () => {
        audio.current.pause()
    }

    //Clean up event
    useEffect(() => () => {
        audio.current.removeEventListener("timeupdate",onTimeUpdateRef.current)
    },[])

    // load music when src Change
    useEffect(() => {
        audio.current.src = src
    },[src])

    return {
        duration,
        currentTime,
        play,
        pause,
        changeCurrentTime:changeCurrentTimeRef.current
    }
}

export default useAudio
