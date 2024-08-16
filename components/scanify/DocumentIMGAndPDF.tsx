"use client"

import React, { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';

// import library
import { loadOpenCV } from '@/lib/opencv';

// import UI
import { Button } from "@/components/ui/button"

// import icons
import { MdOutlineDocumentScanner } from "react-icons/md";
import { LuScanLine } from "react-icons/lu";
import { FiCrop } from "react-icons/fi";
import { LiaUndoAltSolid } from "react-icons/lia";
import { GoDotFill } from "react-icons/go";
import { GrDownload } from "react-icons/gr";

//pdf libraries
import jsPDF from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist/webpack';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf-worker.js';



export const DocumentIMGAndPDF = () => {
    const [isOpencvLoaded, setIsOpencvLoaded] = useState(false);
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [cornerPoints, setCornerPoints] = useState<Point[]>([]);
    // const [circles, setCircles] = useState<{ x: number; y: number; radius: number }[]>([]);
    const [circles, setCircles] = useState<Point[]>([]);

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    // const [scaling, setScaling] = useState({ scaleX: 1, scaleY: 1 });
    const [uploadedFileType, setuploadedFileType] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // doc scanner object
    const docScanner = new documentScanner();



    useEffect(() => {
        checkOpenCVLoaded();
    }, []);

    const checkOpenCVLoaded = () => {
        if (docScanner.isOpenCVLoaded) {
            setIsOpencvLoaded(true);
        } else {
            setTimeout(checkOpenCVLoaded, 100);
            // setIsOpencvLoaded(true);
        }
    };

    const onHandleScanImage = () => {
        if (docScanner.isOpenCVLoaded) {
            const canvas = canvasRef.current;
            if (canvas) {
                const points = docScanner.scanImage(canvas);
                console.log("points -- ", points)
                setCornerPoints(points);
                handleDrawCircles(points); // Use detected points to draw circles
            }
        }
    };

    const onHandleCropImage = () => {
        const canvas = canvasRef.current;
        const cornerPointsToCrop = cornerPoints
        if (canvas) {
            setCornerPoints([])
            docScanner.cropImage(canvas, cornerPointsToCrop);
        }
    };

    const onHandleScanPDF = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            setCornerPoints([])
            const points = docScanner.scanLowerPartImage(canvas);
            setCornerPoints(points)
            console.log("points:",points)
            handleDrawCircles(points); // Use detected points to draw circles

        }
    };

    const onHandleCropPDF = () => {
        const canvas = canvasRef.current;
        const cornerPointsToCrop = cornerPoints
        if (canvas) {
            setCornerPoints([])
            docScanner.cropAndProcessPDF(canvas, cornerPointsToCrop)


        }
    };



    function loadPDFFile(file: File,img:any) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            //const pdf = await pdfjsLib.getDocument(e.target?.result as string).promise;
            const pdf = await pdfjsLib.getDocument(new Uint8Array(e.target?.result as ArrayBuffer)).promise;

            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 2 });

            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                const context = canvas.getContext('2d');
                if (context) {
                    await page.render({ canvasContext: context, viewport }).promise;
                    img.src = canvas.toDataURL('image/png'); // Convert canvas content to image source
                    setImageSrc(canvas.toDataURL('image/png'));                 }
            }

        };
        reader.readAsArrayBuffer(file);

    }

    function loadIMGFile(file: File,img:any) {
        const reader = new FileReader();
        reader.onload = (e) => {
            img.onload = () => {
                const canvas = canvasRef.current;
                if (canvas) {
                    // Initialize the canvas
                    canvas.width = 800;
                    canvas.height = 500;

                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        setImageSrc(e.target?.result as string);
                    }
                }
            };
            if (e.target?.result) {
                img.src = e.target.result as string;
            }
        };
        reader.readAsDataURL(file);
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setCornerPoints([])
        const file = event.target.files?.[0];
        const img = new Image();
        if (file) {
            setIsFileSelected(true);
            const fileType = file.type;
            setuploadedFileType(fileType)
            console.log(file.type)

            if (fileType === 'application/pdf') {
                // Handle PDF file
                loadPDFFile(file,img)
            } else if (fileType.startsWith('image/')) {
                // Handle image file
                loadIMGFile(file,img)
            } else {
                console.error('Unsupported file type');
                setIsFileSelected(false);
            }
        } else {
            setIsFileSelected(false);
        }

        console.log(img)

    };



    const onHandleResetImage = () => {
        setIsFileSelected(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const handleDrawCircles = (points: Point[]) => {
        const circlesData = points.map(point => ({ x: point.x, y: point.y, radius: 5 }));
        drawCirclesAndLines(circlesData);
    };

    const drawCirclesAndLines = (circles: { x: number; y: number;}[]) => {
        console.log(circles)
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (imageSrc) {
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Draw lines between circles
                ctx.strokeStyle = 'green';
                ctx.lineWidth = 3;
                for (let i = 0; i < circles.length; i++) {
                    const nextIndex = (i + 1) % circles.length;
                    ctx.beginPath();
                    ctx.moveTo(circles[i].x, circles[i].y);
                    ctx.lineTo(circles[nextIndex].x, circles[nextIndex].y);
                    ctx.stroke();
                }

                // Draw circles
                circles.forEach(circle => {
                    ctx.fillStyle = 'green';
                    ctx.beginPath();
                    ctx.arc(circle.x, circle.y, 5, 0, 2 * Math.PI);
                    ctx.fill();
                });
            };
        }
    };

    const handleDrag = (index: number, e: any, data: any) => {
        const updatedCircles = cornerPoints.map((circle, i) => {
            if (i === index) {
                return { ...circle, x: data.x + 5, y: data.y + 5 };
            }
            return circle;
        });
        setCircles(updatedCircles);
        drawCirclesAndLines(updatedCircles);
        setCornerPoints(updatedCircles)
    };





    const handleDownloadFile = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw watermark
        ctx.font = 'bold 40px Arial';
        ctx.fillStyle = 'red';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const watermarkText = 'Document Scanner';
        const x = canvas.width / 2;
        const y = canvas.height - 50; // Adjust the position as needed

        ctx.fillText(watermarkText, x, y);

        // Check the file type
        if (uploadedFileType === 'application/pdf') {
            // Create an image from the canvas
            const imageFileUrl = canvas.toDataURL('image/jpeg'); // Convert canvas to image
            const fileExt = 'pdf'
            // Convert image to PDF
            const pdf = new jsPDF();
            pdf.addImage(imageFileUrl, 'JPEG', 0, 0, canvas.width, canvas.height);
            pdf.save(`scanner-document.pdf`);

        } else if (['png', 'jpeg', 'jpg'].some(ext => uploadedFileType?.endsWith(ext))) {
            // Create an image from the canvas
            const imageFileUrl = canvas.toDataURL(`image/png`);
            const fileExt = 'png'

            const link = document.createElement('a');
            link.href = imageFileUrl;
            link.download = `scanner-image.${fileExt}`;
            return link.click();

        }
    };


    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <header className="p-4">
                <div className="w-fit bg-white shadow p-6 rounded-md">
                    <h1 className="flex text-3xl font-semibold text-gray-700 space-x-2">
                        <MdOutlineDocumentScanner />
                        <span>Document Scanner</span>
                    </h1>
                    <div className="flex text-sm text-gray-500 mt-1 space-x-2">
                        <span className="font-medium">Scanner status : </span>
                        {
                            isOpencvLoaded ?
                                <span className="flex"><GoDotFill className="w-5 h-5 text-green-600" /> Ready </span> :
                                <span className="flex"><GoDotFill className="w-5 h-5  text-red-600" /> Loading... </span>
                        }
                    </div>
                </div>
            </header>

            <div className="flex flex-grow flex-col w-full items-center justify-center p-2">
                {
                    !isOpencvLoaded ?
                        <div className="h-64 w-64 max-w-2xl relative border-2 border-neutral-300 shadow rounded-lg my-5">
                            <div className="h-full w-full bg-white absolute z-1 flex justify-center items-center top-0 rounded-lg">
                                <div className="flex flex-col items-center ">


                                    <span className="text-2xl text-gray-500 ">Loading</span>

                                </div>
                            </div>
                        </div> : ""

                }
                {!isFileSelected && isOpencvLoaded && (
                    <div className="h-96 w-full max-w-2xl relative border-4 border-gray-300 border-dashed rounded-lg ">
                        <input ref={fileInputRef} type="file" onChange={handleFileChange} className="h-full w-full opacity-0 absolute z-10 cursor-pointer" />
                        <div className="h-full w-full bg-white absolute z-1 flex justify-center items-center top-0 rounded-lg">
                            <div className="flex flex-col items-center">
                                <i className="mdi mdi-folder-open text-[50px] text-gray-400"></i>
                                <span className="text-lg text-gray-500 mt-2">Drag and Drop a file</span>
                                <span className="text-xs text-gray-400">or click to browse</span>
                            </div>
                        </div>
                    </div>
                )}
                {isFileSelected && isOpencvLoaded && (
                    <div
                        style={{
                            position: 'relative',
                            width: '800px',
                            height: '500px',
                            margin: '20px auto',
                        }}
                    >
                        <canvas
                            ref={canvasRef}
                            // className="w-[800px] h-[600px]"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '800px',
                                height: '500px',
                                border: '2px solid gray'
                            }}
                        />
                        {cornerPoints.map((circle, index) => (
                            <Draggable
                                key={index}
                                nodeRef={canvasRef} 
                                position={{ x: circle.x - 5, y: circle.y - 5 }}
                                onDrag={(e, data) => handleDrag(index, e, data)}
                                bounds="parent"
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        backgroundColor: 'red',
                                        cursor: 'pointer',
                                        top: 0,
                                        left: 0,
                                    }}
                                />

                            </Draggable>
                        ))}
                    </div>
                )}
            </div>


            {/* Footer */}
            <footer className="flex absolute1 bottom-01 w-full justify-end p-2 space-x-4  ">
                <div className="flex w-2/3 p-4 bg-white border shadow-md items-center justify-center align-middle space-x-3 mx-auto rounded-md ">
                    {uploadedFileType?.includes('pdf') ? (
                        <Button
                            className="space-x-2"
                            onClick={() => onHandleScanPDF()}
                        >
                            <LuScanLine className="w-6 h-6" />
                            <span>Scan File</span>
                        </Button>
                    ) : (<Button
                        className="space-x-2"
                        onClick={() => onHandleScanImage()}
                    >
                        <LuScanLine className="w-6 h-6" />
                        <span>Scan Image</span>
                    </Button>)


                    }

                    {uploadedFileType?.includes('pdf') ? (
                        <Button
                            className="space-x-2"
                            onClick={() => onHandleCropPDF()}
                        >
                            <FiCrop className="w-6 h-6" />
                            <span>Crop File</span>
                        </Button>
                    ) : (<Button
                        className="space-x-2"
                        onClick={() => onHandleCropImage()}
                    >
                        <FiCrop className="w-6 h-6" />
                        <span>Crop Image</span>
                    </Button>)


                    }
                    <Button
                        className="space-x-2"
                        onClick={() => handleDownloadFile()}
                    >
                        <GrDownload className="w-5 h-5" />
                        <span>Download Image</span>
                    </Button>

                    {isFileSelected && (
                        <Button
                            variant="destructive"
                            className="space-x-2"
                            onClick={() => onHandleResetImage()}
                        >
                            <LiaUndoAltSolid className="w-6 h-6" />
                            <span>Reset</span>

                        </Button>
                    )}
                </div>
            </footer>
        </div>
    );
};

interface Point {
    x: number;
    y: number;
}

class documentScanner {
    cv: any;
    isOpenCVLoaded: boolean = false;
    isImageScanned: boolean = false;
    maxContour: any;
    points: Point[] | null = null;

    constructor() {
        this.isOpenCVLoaded = false;
        this.load();
    }

    async load() {
        try {
            await loadOpenCV();
            this.isOpenCVLoaded = true;
            this.cv = window.cv;
        } catch (err) {
            console.error(err);
        }
    }

    scanImage(canvas: HTMLCanvasElement) {
        // this.canvas = canvas;
        const src = this.cv.imread(canvas);

        const gray = new this.cv.Mat();
        this.cv.cvtColor(src, gray, this.cv.COLOR_RGBA2GRAY);

        const blur = new this.cv.Mat();
        this.cv.GaussianBlur(gray, blur, new this.cv.Size(5, 5), 0, 0, this.cv.BORDER_DEFAULT);

        const thresh = new this.cv.Mat();
        this.cv.threshold(blur, thresh, 0, 255, this.cv.THRESH_BINARY + this.cv.THRESH_OTSU);

        let contours = new this.cv.MatVector();
        let hierarchy = new this.cv.Mat();

        this.cv.findContours(thresh, contours, hierarchy, this.cv.RETR_CCOMP, this.cv.CHAIN_APPROX_SIMPLE);

        let maxArea = 0;
        let maxContourIndex = -1;
        for (let i = 0; i < contours.size(); ++i) {
            let contourArea = this.cv.contourArea(contours.get(i));
            if (contourArea > maxArea) {
                maxArea = contourArea;
                maxContourIndex = i;
            }
        }

        this.maxContour = contours.get(maxContourIndex);
        this.points = this.detectCornerPoints(this.maxContour);
        this.isImageScanned = true;

        src.delete();

        return this.points;
    }

    detectCornerPoints(contour: any): Point[] {
        let points: Point[] = [];
        let rect = this.cv.minAreaRect(contour);
        const center = rect.center;

        let topLeftPoint;
        let topLeftDistance = 0;

        let topRightPoint;
        let topRightDistance = 0;

        let bottomLeftPoint;
        let bottomLeftDistance = 0;

        let bottomRightPoint;
        let bottomRightDistance = 0;

        for (let i = 0; i < contour.data32S.length; i += 2) {
            const point = { x: contour.data32S[i], y: contour.data32S[i + 1] };
            const distance = this.getDistance(point, center);
            if (point.x < center.x && point.y < center.y) {
                if (distance > topLeftDistance) {
                    topLeftPoint = point;
                    topLeftDistance = distance;
                }
            } else if (point.x > center.x && point.y < center.y) {
                if (distance > topRightDistance) {
                    topRightPoint = point;
                    topRightDistance = distance;
                }
            } else if (point.x < center.x && point.y > center.y) {
                if (distance > bottomLeftDistance) {
                    bottomLeftPoint = point;
                    bottomLeftDistance = distance;
                }
            } else if (point.x > center.x && point.y > center.y) {
                if (distance > bottomRightDistance) {
                    bottomRightPoint = point;
                    bottomRightDistance = distance;
                }
            }
        }

        points.push(topLeftPoint as Point);
        points.push(topRightPoint as Point);
        points.push(bottomRightPoint as Point);
        points.push(bottomLeftPoint as Point);
        return points;
    }

    getDistance(p1: Point, p2: Point) {
        return Math.hypot(p1.x - p2.x, p1.y - p2.y);
    }

    cropImage(canvas: HTMLCanvasElement, points: Point[]) {
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx && points.length === 4) {
            const src = this.cv.imread(canvas);
            const dst = new this.cv.Mat();
            const pts1 = this.cv.matFromArray(4, 1, this.cv.CV_32FC2, [
                points[0].x, points[0].y,
                points[1].x, points[1].y,
                points[2].x, points[2].y,
                points[3].x, points[3].y,
            ]);
            const width = Math.max(
                this.getDistance(points[0], points[1]),
                this.getDistance(points[2], points[3])
            );
            const height = Math.max(
                this.getDistance(points[0], points[3]),
                this.getDistance(points[1], points[2])
            );
            const pts2 = this.cv.matFromArray(4, 1, this.cv.CV_32FC2, [
                0, 0,
                width, 0,
                width, height,
                0, height,
            ]);
            const M = this.cv.getPerspectiveTransform(pts1, pts2);

            // Clear the canvas entirely, removing any previous drawings
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Resize the canvas to the new dimensions
            canvas.width = width;
            canvas.height = height;

            this.cv.warpPerspective(src, dst, M, new this.cv.Size(width, height));
            this.cv.imshow(canvas, dst);

            // Cleanup OpenCV objects
            src.delete();
            dst.delete();
            pts1.delete();
            pts2.delete();
            M.delete();
        }
    }

    scanLowerPartImage(canvas: HTMLCanvasElement) {
        const src = this.cv.imread(canvas);
    
        // Calculate height and width
        const height = src.rows;
        const width = src.cols;
    
        // Calculate the height for the bottom 35% of the image
        const croppedHeight = Math.floor(height * 0.35);
    
        // Calculate the starting Y coordinate for cropping (bottom part of the image)
        const yStart = height - croppedHeight;
    
        // Crop the image to the lower 35%
        const cropped = src.roi(new this.cv.Rect(0, yStart, width, croppedHeight));
    
        const gray = new this.cv.Mat();
        this.cv.cvtColor(cropped, gray, this.cv.COLOR_RGBA2GRAY);
    
        const blur = new this.cv.Mat();
        this.cv.GaussianBlur(gray, blur, new this.cv.Size(5, 5), 0, 0, this.cv.BORDER_DEFAULT);
    
        const thresh = new this.cv.Mat();
        this.cv.threshold(blur, thresh, 0, 255, this.cv.THRESH_BINARY + this.cv.THRESH_OTSU);
    
        let contours = new this.cv.MatVector();
        let hierarchy = new this.cv.Mat();
    
        this.cv.findContours(thresh, contours, hierarchy, this.cv.RETR_CCOMP, this.cv.CHAIN_APPROX_SIMPLE);
    
        let maxArea = 0;
        let maxContourIndex = -1;
        for (let i = 0; i < contours.size(); ++i) {
            let contourArea = this.cv.contourArea(contours.get(i));
            if (contourArea > maxArea) {
                maxArea = contourArea;
                maxContourIndex = i;
            }
        }
    
        if (maxContourIndex === -1) {
            src.delete();
            cropped.delete();
            gray.delete();
            blur.delete();
            thresh.delete();
            contours.delete();
            hierarchy.delete();
            console.error('No contours found in the image.');
            return [];
        }
    
        this.maxContour = contours.get(maxContourIndex);

   this.points = this.detectCornerPoints(this.maxContour);
    this.points = this.points.map(point => ({
        x: point.x,
        y: point.y + yStart
    }));       
        this.isImageScanned = true;
    
        // Clean up memory
        src.delete();
        cropped.delete();
        gray.delete();
        blur.delete();
        thresh.delete();
        contours.delete();
        hierarchy.delete();
    
        return this.points;
    }
    
    
    
    cropAndProcessPDF(canvas: HTMLCanvasElement, points: Point[]) {
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx && points.length === 4) {
            const src = this.cv.imread(canvas);

            // Create a Rect using the provided points
            const [topLeft, topRight, bottomRight, bottomLeft] = points;

            // Define a bounding rectangle based on the provided points
            const xMin = Math.min(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
            const xMax = Math.max(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
            const yMin = Math.min(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
            const yMax = Math.max(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);

            const cropRect = new this.cv.Rect(xMin, yMin, xMax - xMin, yMax - yMin);
            const cropped = src.roi(cropRect);

            // Divide the cropped image into left and right parts (50:50 division)
            const croppedWidth = cropped.cols;
            const croppedHeight = cropped.rows;
            const leftPart = cropped.roi(new this.cv.Rect(0, 0, Math.floor(croppedWidth * 0.5), croppedHeight));
            const rightPart = cropped.roi(new this.cv.Rect(Math.floor(croppedWidth * 0.5), 0, Math.floor(croppedWidth * 0.5), croppedHeight));

            // Create a new Mat to combine the right part below the left part
            const combined = new this.cv.Mat(croppedHeight * 2, leftPart.cols, cropped.type());

            leftPart.copyTo(combined.rowRange(0, croppedHeight).colRange(0, leftPart.cols));
            rightPart.copyTo(combined.rowRange(croppedHeight, croppedHeight * 2).colRange(0, rightPart.cols));

            // Clear the canvas and resize to match the new image

            // Store the combined image for later download

            // Calculate the perspective transformation matrix


            const pts1 = this.cv.matFromArray(4, 1, this.cv.CV_32FC2, [
                topLeft.x, topLeft.y,
                topRight.x, topRight.y,
                bottomRight.x, bottomRight.y,
                bottomLeft.x, bottomLeft.y,
            ]);
            const pts2 = this.cv.matFromArray(4, 1, this.cv.CV_32FC2, [
                0, 0,
                canvas.width, 0,
                canvas.width, canvas.height,
                0, canvas.height
            ])
            const dst = new this.cv.Mat();

            const M = this.cv.getPerspectiveTransform(pts1, pts2);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = leftPart.cols;
            canvas.height = croppedHeight * 2;

            this.cv.warpPerspective(combined, dst, M, new this.cv.Size(canvas.width, canvas.height));

            // Display the final image on the canvas
            this.cv.imshow(canvas, combined);

            // Cleanup

            src.delete();
            cropped.delete();
            leftPart.delete();
            rightPart.delete();
            combined.delete();
            M.delete()
        } else {
            console.error("Invalid input: canvas context or points are not properly provided.");
        }
    }

}
