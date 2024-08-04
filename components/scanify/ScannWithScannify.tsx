"use client"
import React, { useRef, useEffect, useState } from 'react';
import jscanify from 'jscanify'
import { loadOpenCV } from '@/lib/opencv';


export const ScannWithScannify = () => {
    const [opencvLoaded, setOpencvLoaded] = useState(false);
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
    }, [])

    const scanner = new jscanify();
    const paperWidth = 500;
    const paperHeight = 1000;
    

    return (
        <div className=""> 
          <video id="video"></video>
          <canvas id="canvas"></canvas>
          <canvas id="result"></canvas>
        </div>
      )
      

}
