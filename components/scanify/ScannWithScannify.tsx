
"use client";
import React, { useRef, useEffect, useState } from 'react';
// import { OpenCvProvider, useOpenCv } from 'opencv-react';
import Cropper from 'react-perspective-cropper';
import { loadOpenCV } from '@/lib/opencv';
import { ImageUploader } from './ImageUploader';
const ScannWithScannify = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
    const [opencvLoaded, setOpencvLoaded] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);

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

    const paperWidth = 500;
    const paperHeight = 1000;
    const handleImageUpload = (file: File) => {
      setUploadedImage(file);

  };

    return (
        <div className=""> 
          <div>scan with scannify -</div>
                <div className="mt-4 flex justify-center">
                {uploadedImage && (<img
                    ref={imageRef}
                    src={URL.createObjectURL(uploadedImage!)}
                    alt="Uploaded Document"
                    className="max-w-full h-auto rounded-lg border-2 border-gray-300 shadow-lg"
                />)}
            </div>
           
            <div className="mt-4 flex justify-center">
            
            <canvas ref={canvasRef}
            className="max-w-full h-auto rounded-lg border-2 border-gray-300 shadow-lg"

            ></canvas> 
            
            </div>
            {/* <ImageUploader onImageUpload={handleImageUpload} /> */}

        </div>
      )
      

}

export default ScannWithScannify