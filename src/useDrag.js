import {useMemo, useState, useRef, useEffect} from "react";
import * as React from "react";

function useDrag(
    triggerChange,
    onAfterChange,
    onStartChange,

    //values
    min = 0,
    max = 100,
    value,

    //ref
    trackRef
) {
    const [cacheValue,setCacheValue] = useState(0)
    const mouseUpEventRef = useRef(null)
    const mouseMoveEventRef = useRef(null)

    useEffect(() => {
            setCacheValue(value)
    },[value])

    useEffect(
        () => () => {
            document.removeEventListener('mousemove', mouseMoveEventRef.current);
            document.removeEventListener('mouseup', mouseUpEventRef.current);
        },
        [],
    );


    const flushValue = (value) => {
        let calValue = Math.floor(value * (max - min))

        setCacheValue(value)
        if(triggerChange)triggerChange(calValue)
    }

    const updateCacheValue = (offsetPercentage) => {
        let formatValue
        offsetPercentage = offsetPercentage + cacheValue

        formatValue = Math.min(1,offsetPercentage)
        formatValue = Math.max(0,formatValue)

        flushValue(formatValue)
    }

    const onMouseDown = (e) => {
        e.preventDefault()

        if(onStartChange)onStartChange()

        let startX = e.pageX;

        const onMouseMove = (e) => {
            e.preventDefault()

            let moveX = e.pageX;
            const offsetX = (moveX - startX)
            const offsetPercentage = offsetX / 300

            updateCacheValue(offsetPercentage)
        }

        // end
        const onMouseUp = (e) => {
            document.removeEventListener("mouseup",onMouseUp)
            document.removeEventListener("mousemove",onMouseMove)
            mouseMoveEventRef.current = null;
            mouseUpEventRef.current = null;

            if(onAfterChange)onAfterChange()
        }

        document.addEventListener("mousemove",onMouseMove)
        document.addEventListener("mouseup",onMouseUp)
        mouseMoveEventRef.current = onMouseMove;
        mouseUpEventRef.current = onMouseUp;
    }

    return [cacheValue,onMouseDown]
}

export default useDrag