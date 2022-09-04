import { useCallback, useEffect, useRef, useState } from "react";



function useCountDown(
    leftTime: number
) {
    const [countDown,setCountDown] = useState(0)
    const timerRef = useRef<NodeJS.Timer | null>(null);

    useEffect(() => () => {
        if(timerRef.current) {
            clearInterval(timerRef.current)
        }
    },[])
    
    const stop = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const reset = useCallback(() => {
        stop();
        setCountDown(leftTime);
    }, [stop, leftTime]);

    const start = useCallback(() => {
        if(timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null;
        }
        setCountDown(leftTime);

        timerRef.current = setInterval(() => {
            setCountDown(
                // always get the newest countDown
                (countDown) => {
                    if (countDown === 0) {
                        stop();

                        return 0;
                    }

                    return countDown - 1;
                }
            );
        }, 1000);
    },[stop,setCountDown,leftTime]);
    
    return {
        countDown,
        start,
        stop,
        reset,
    };
}

export default useCountDown;