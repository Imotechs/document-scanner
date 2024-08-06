"use client";

import React, {useCallback, ForwardedRef, forwardRef,useRef,useState } from 'react';
import Cropper from 'react-perspective-cropper'
import {DownloadOutlined,BorderOutlined,ScanOutlined,UndoOutlined, StarTwoTone } from '@ant-design/icons';

interface ImageUploaderProps {
    onImageUpload: (file: File) => void;
}
interface CropState {
    x: 0;
    y: 0;
    width: 100;
    height: 100;
  }
const AnyCropper = Cropper as any;

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadedImage, setUploadedImage] =  useState<File | null>(null);
    const [cropState, setCropState] = useState<CropState | null>(null);
    const cropperRef = useRef<any>(null);

  const onDragStop = useCallback((state: CropState) => setCropState(state), []);
  const onChange = useCallback((state: CropState) => setCropState(state), []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageUpload(file);
            setUploadedImage(file)

        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };
    function onHandleCropImage(){

    }
    function onHandleScanImage(){
    
    }
   
    
  const handleProcessImage = async () => {
    try {
      const filterParams = {
        preview: true,
        filterCvParams: {
          blur: false,
          th: false,
          thMode: window.cv.ADAPTIVE_THRESH_MEAN_C,
          thMeanCorrection: 15,
          thBlockSize: 25,
          thMax: 255,
          grayScale: false,
        },
      };
      const res = await cropperRef.current.done(filterParams);
      console.log('Processed Image:', res);
      
    } catch (e) {
      console.error('Error processing image:', e);
    }
  };

  function downloadImage (ImageURL:any){
  
    // const downloadLink = document.createElement('a');
    //       downloadLink.href = ImageURL.current;
    //       downloadLink.download = 'image.png';
    //       downloadLink.click();
  }
    return (
<>

        <div className="flex flex-col min-h-screen relative">
            <div className="bg-gray-200 p-4">
                <h1 className="text-2xl font-bold">Document Scanner</h1>
            </div>
            <div className="flex-grow bg-gray-100 p-5 flex items-center justify-center">

                {!uploadedImage && (
                    <div className=" h-96 w-full relative border-2 items-center border-gray-400 border-dashed ">
                        <div className="h-full w-full bg-gray-200 absolute z-1 flex justify-center items-center top-0">
                
          
                        <input 
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute opacity-0 cursor-pointer w-full h-full"
                            />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-gray-500"
        >
          <path
            fillRule="evenodd"
            d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
            clipRule="evenodd"
          />
        </svg>
            

                            <div className="flex flex-col">
                                <i className="mdi mdi-folder-open text-[30px] text-gray-400 text-center"></i>
                                <span className="text-[12px]">{`Choose an Image|Drag and Drop a file`}</span>
                            </div>
                        </div>
                    </div>
                )}
                <AnyCropper
        ref={cropperRef}
        image={uploadedImage}
        onChange={onChange}
        onDragStop={onDragStop}
        cropperRef={cropperRef}
        pointSize={10}
        lineWidth={2}
        pointBgColor="red"
        pointBorder="2px solid black"
        lineColor="blue"
        maxWidth={500}
        maxHeight={500}
        openCvPath="/opencv.js"
      />


            </div>

            <div className="flex w-full fixed bottom-0 p-5 justify-end space-x-2">
            {/* <button  className="bg-red-500 text-white px-4 py-2 rounded">Crop-out</button> */}
            </div>
            
            {/* nav icons */}
            <div className=" rounded-[30px] mt-0 mb-5  bottom-0 p-5 items-center justify-center space-x-5 bg-gray-900 mx-auto max-w-max">

                        <DownloadOutlined title="Download"onClick={()=>downloadImage(cropperRef)} className="bg-blue-500 text-black px-4 py-2 rounded"
                        />
                        <BorderOutlined title="Crop image"  onClick={()=>handleProcessImage()} className="bg-blue-500 text-black px-4 py-2 rounded" />
                        <StarTwoTone title="Star" className="bg-blue-500 text-black px-4 py-2 rounded"/>
                        <ScanOutlined title="Scan" className="bg-blue-500 text-black px-4 py-2 rounded" />
                        <UndoOutlined title="Undo"  className="bg-blue-500 text-black px-4 py-2 rounded"/>
        </div>

        </div>

        

            
</>

);
};
