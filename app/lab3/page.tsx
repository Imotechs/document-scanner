// "use client"
// import React,{useState,useEffect,useRef,useCallback} from 'react'
// import {DownloadOutlined,BorderOutlined,ScanOutlined,RedoOutlined, StarTwoTone } from '@ant-design/icons';
// import Cropper from 'react-perspective-cropper'
// import { loadOpenCV } from '@/lib/opencv';


// import CropperComponent2 from '@/components/scanify/CroperComponent'
// import { DocumentScanner } from '@/components/scanify/DocumentScanner';
// interface CropState {
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//   }
//   const AnyCropper = Cropper as any;

// const Lab3Page = () => {
//     const [uploadedImage, setUploadedImage] = useState<File | null>(null);
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const [cropState, setCropState] = useState<CropState | null>(null);
//     const cropperRef = useRef<any>(null);
//     const ScanRef = useRef<any>(null);
//     const [scann, setScann] = useState(true)
//     const canvasRef = useRef<HTMLCanvasElement>(null);
//     const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);


//   const onDragStop = useCallback((state: CropState) => setCropState(state), []);
//   const onChange = useCallback((state: CropState) => setCropState(state), []);

//   const [opencvLoaded, setOpencvLoaded] = useState(false);
//   useEffect(() => {
//     const load = async () => {
//         try {
//             await loadOpenCV();
//             setOpencvLoaded(true);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     load();
// }, []);
// useEffect(() => {
//     if (uploadedImage && scann) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//             const img = new Image();
//             img.onload = () => {
//                 const canvas = canvasRef.current;
//                 if (canvas) {
//                     const ctx = canvas.getContext('2d');
//                     if (ctx) {
//                         // Clear the canvas
//                         ctx.clearRect(0, 0, canvas.width, canvas.height);
//                         // Resize the canvas to fit the image
//                         canvas.width = img.width;
//                         canvas.height = img.height;
//                         // Draw the image on the canvas
//                         ctx.drawImage(img, 0, 0);
//                     }
//                 }
//             };
//             if (e.target?.result) {
//                 img.src = e.target.result as string;
//             }
//         };
//         reader.readAsDataURL(uploadedImage);
//     }
// }, [uploadedImage, scann]);

// if (!opencvLoaded) {
//     return document.getElementById('header')?.innerHTML=='Loading...';
//   }

//   const onScanImage = () => {
//     if(ScanRef.current){
//         setScann(true)
//         ScanRef.current.scanImage();
//     }
  
//   };
//   function onCropImage(){
//     if(  ScanRef.current){
//         setScann(true)
//         ScanRef.current.cropImage();
//     }
//   }
//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setScann(true)
//         const file = event.target.files?.[0];
//         if (file) {
//             setUploadedImage(file);
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 const img = new Image();
//                 img.onload = () => {
//                     const canvas = canvasRef.current;
//                     setImageSize({ width: img.width, height: img.height });

//                     const initialCropState: CropState = {
//                         x: img.width * 0.3, // 10% from the left
//                         y: img.height * 0.3, // 10% from the top
//                         width: img.width * 0.8, // 80% of the image width
//                         height: img.height * 0.8, // 80% of the image height
//                       };
//                       setCropState(initialCropState);

//                     if (canvas) {
//                         const ctx = canvas.getContext('2d');
//                         if (ctx) {
//                             // Clear the canvas
//                             ctx.clearRect(0, 0, canvas.width, canvas.height);
//                             // Resize the canvas to fit the image
//                             canvas.width = img.width;
//                             canvas.height = img.height;
//                             // Draw the image on the canvas
//                             ctx.drawImage(img, 0, 0);
//                         }
//                     }
//                 };
//                 if (e.target?.result) {
//                     img.src = e.target.result as string;
//                 }
//             };
//             reader.readAsDataURL(file);
//         } else {
//             setUploadedImage(null);
//         }
//     };

//     function downloadImage(){

//     }
//     const handleResetImage = () => {
//         setUploadedImage(null);
//         if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//         }
//         const canvas = canvasRef.current;
//         if (canvas) {
//             const ctx = canvas.getContext('2d');
//             if (ctx) {
//                 ctx.clearRect(0, 0, canvas.width, canvas.height);
//             }
//         }
//     };
//     function changeAction() {
//         setScann(!scann)
       
//       }

// function lastCanvase (){
//         const canvases = document.querySelectorAll('canvas');
//         if (canvases.length > 0) {
//             const lastCanvas = canvases[canvases.length - 1];
//             return lastCanvas;}}
            
// const downloadFile = () => {

//         var canvas =canvasRef.current
//         if(!scann){
//         canvas = lastCanvase()! 
//         }
//         if (canvas) {
//             const ctx = canvas.getContext('2d');
//             console.log('canvas')

//             if (ctx) {
//                 // Draw watermark
//                 ctx.font = 'bold 40px Arial';
//                 ctx.fillStyle = 'red';
//                 ctx.textAlign = 'center';
//                 ctx.textBaseline = 'middle';
//                 const watermarkText = 'Document Scanner';
//                 const x = canvas.width / 2;
//                 const y = canvas.height - 50; // Adjust the position as needed
    
//                 ctx.fillText(watermarkText, x, y);
    
//                 // Create an image from the canvas
//                 const imageUrl = canvas.toDataURL('image/png');
//                 // Create a link element and click it to download the image
//                 const link = document.createElement('a');
//                 link.href = imageUrl;
//                 link.download = 'scanner-image.png';
//                 link.click();
//             }
//         }
//         console.log(canvas)
//     };
      
//     const handleProcessImage = async () => {
//         if(cropperRef.current){
//         try {
//           const filterParams = {
//             preview: true,
//             filterCvParams: {
//               blur: false,
//               th: false,
//               thMode: window.cv.ADAPTIVE_THRESH_MEAN_C,
//               thMeanCorrection: 15,
//               thBlockSize: 25,
//               thMax: 255,
//               grayScale: false,
//             },
//           };
//           const res = await cropperRef.current.done(filterParams);
//           console.log('Processed Image:', res);
          
//         } catch (e) {
//           console.error('Error processing image:', e);
//         }
//     }
//       };

    
//     return (
//         <>

    
//         {/* <CropperComponent2/> */}
         
//         <div className="flex flex-col min-h-screen relative">
//             <div className="bg-gray-600 p-4">
//                 <h1 className="text-2xl text-white font-bold" id='header'>Document Scanner</h1>
//             </div>
//             <div className="flex-grow bg-gray-100 p-5 flex items-center justify-center">

//                 {!uploadedImage && (
//                     <div className=" h-96 w-full relative border-2 items-center border-gray-400 border-dashed ">
//                         <div className="h-full w-full bg-gray-200 absolute z-1 flex justify-center items-center top-0">
                
          
//                         <input 
//                             ref={fileInputRef}
//                             type="file"
//                             accept="image/*"
//                             onChange={handleFileChange}
//                             className="absolute opacity-0 cursor-pointer w-full h-full"
//                             />

//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 24 24"
//           fill="currentColor"
//           className="w-6 h-6 text-gray-500"
//         >
//           <path
//             fillRule="evenodd"
//             d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
//             clipRule="evenodd"
//           />
//         </svg>
            

//                             <div className="flex flex-col">
//                                 <i className="mdi mdi-folder-open text-[30px] text-gray-400 text-center"></i>
//                                 <span className="text-[12px]">{`Choose an Image|Drag and Drop a file`}</span>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//                 {scann? <>{uploadedImage?
//                 <canvas ref={canvasRef} className=" min-w-[300px] max-w-[800px] "></canvas>:''} </>:
//                 <><AnyCropper
//         ref={cropperRef}
//         image={uploadedImage}
//         onChange={onChange}
//         onDragStop={onDragStop}
//         cropperRef={cropperRef}
//         cropState={cropState} 
//         pointSize={10}
//         lineWidth={3}
//         pointBgColor="red"
//         pointBorder="4px solid black"
//         lineColor="blue"
//         maxWidth=  {imageSize?.width}
//         maxHeight= {imageSize?.height}
//         openCvPath="/opencv.js"
//       /> </>}

//             </div>

//             <div className="flex w-full fixed bottom-0 p-5 justify-end space-x-2">
//             </div>
            
//             <div className=" rounded-[30px] mt-0 mb-5  bottom-0 p-5 items-center justify-center space-x-5 bg-gray-700 mx-auto max-w-max">

//                         <DownloadOutlined title="Download"onClick={downloadFile} className="bg-blue-500 text-black px-4 py-2 rounded"
//                         />
//                         <BorderOutlined title="Crop image" onClick={scann ? onCropImage : handleProcessImage} className="bg-blue-500 text-black px-4 py-2 rounded" />
//                         <StarTwoTone title="Change action" onClick={changeAction} className="bg-blue-200 text-black px-4 py-2 rounded"/>
//                         <ScanOutlined  title="Scann" onClick={()=>onScanImage()} className="bg-blue-500 text-black px-4 py-2 rounded" />
//                         <RedoOutlined title="Discard" onClick={handleResetImage} className="bg-blue-500 text-black px-4 py-2 rounded"/>
//         </div>

//         </div>

//         {scann &&fileInputRef?(<DocumentScanner ref={ScanRef} fileInputRef={fileInputRef} canvasRef= {canvasRef}/>
// ):''}

            

//         </>
//     )
// }

// export default Lab3Page
import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page