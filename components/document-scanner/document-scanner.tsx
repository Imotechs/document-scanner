"use client"

import React, { useRef, useEffect, useState } from 'react';
import { loadOpenCV } from '@/lib/opencv';

export const DocumentScanner = () => {
    const [opencvLoaded, setOpencvLoaded] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);    

    useEffect(() => {
        const load = async () => {
          try {
            await loadOpenCV();
            setOpencvLoaded(true);
          } catch (err) {
            console.error(err);
          }
        };
    
        load();
    }, []);    


    useEffect(() => {
        console.log("opencvLoaded - ", opencvLoaded)
        if (opencvLoaded) {
          const cv = window.cv;
    
          const image = imageRef.current;
          const canvas = canvasRef.current;
    
          
          if (image && canvas && cv) {
            const src = cv.imread(image);
            console.log("src")
            // const dst = new cv.Mat();
    
            // cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
            // cv.imshow(canvas, dst);
    
            // src.delete();
            // dst.delete();
          }
        }
    }, [opencvLoaded]);
    const onHandleProcessImage = () => {
        console.log("clicked")
        if (opencvLoaded) {
            console.log("OpenCV status is fine")

            const cv = window.cv;
            console.log("cv loaded - ", cv)

            const image = imageRef.current;
            const canvas = canvasRef.current;            
            console.log("image - ", image)
            console.log("canvas - ", canvas)

            const src = cv.imread(image);
            console.log("image src - ", src)

            const dst = new cv.Mat();
            console.log("dst - ", dst)

            cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
            cv.imshow(canvas, dst);

            src.delete();
            dst.delete();
        }
    }
    
    return (
        <>
            <div>DocumentScanner</div>
            <div>opencv status - { opencvLoaded ? "Loaded" : "Not loaded" }</div>
            <div>
                <img ref={imageRef} src="/images/sample-001.jpg" alt="Input"  />
            </div>
            <button onClick={(e)=>onHandleProcessImage()} >click</button>

            <canvas ref={canvasRef}></canvas>
        </>
    )
}
