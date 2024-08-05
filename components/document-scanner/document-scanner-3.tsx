"use client"

import React, { useRef, useEffect, useState } from 'react';

// import library
import { loadOpenCV } from '@/lib/opencv';

export const DocumentScanner3 = () => {
    const [isOpencvLoaded, setIsOpencvLoaded] = useState(false);
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [cornerPoints, setCornerPoints] = useState<Point[]>([]);

    // imageRef and imageSrc
    const imageRef = useRef<HTMLImageElement>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // doc scanner object
    const docScanner = new documentScanner()

    useEffect(() => {
        checkOpenCVLoaded();
    }, []);

    const checkOpenCVLoaded = () => {
        if (docScanner.isOpenCVLoaded) {
            setIsOpencvLoaded(true);
        } else {
            // Re-check if OpenCV is not loaded yet
            setTimeout(checkOpenCVLoaded, 100);
        }
    };

    const onHandleScanImage = () => {
        console.log("Initiate scan image")
        if (docScanner.isOpenCVLoaded) {
            // check openCV status
            console.log("OpenCV status is fine")

            // scan image & get corner points
            const canvas = canvasRef.current
            if (canvas) {
                const points = docScanner.scanImage(canvas)
                setCornerPoints(points)
                docScanner.drawOutline()
            }
        }
    }
    const onHandleCropImage = () => {
        const canvas = canvasRef.current
        console.log(canvas)
        if (canvas) {
            docScanner.cropImage(canvas, cornerPoints)
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsFileSelected(true);
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = canvasRef.current;
                    if (canvas) {
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            // Clear the canvas
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            // Resize the canvas to fit the image
                            canvas.width = img.width;
                            canvas.height = img.height;
                            // Draw the image on the canvas
                            ctx.drawImage(img, 0, 0);
                        }
                    }
                };
                if (e.target?.result) {
                    img.src = e.target.result as string;
                }
            };
            reader.readAsDataURL(file);
        } else {
            setIsFileSelected(false);
        }
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

    return (
        <div className="flex flex-col min-h-screen relative">
            <div className="bg-gray-200 p-4">
                <h1 className="text-2xl font-bold">Document Scanner</h1>
            </div>

            <div className="flex-grow bg-gray-100 p-10 flex items-center justify-center">

                {/* <p className="text-gray-500">Content Area</p> */}

                {!isFileSelected && (
                    <div className=" h-96 w-full relative border-2 items-center border-gray-400 border-dashed ">
                        <input ref={fileInputRef} type="file" onChange={handleFileChange} className="h-full w-full opacity-0 z-10 absolute" name="files[]" />
                        <div className="h-full w-full bg-gray-200 absolute z-1 flex justify-center items-center top-0">
                            <div className="flex flex-col">
                                <i className="mdi mdi-folder-open text-[30px] text-gray-400 text-center"></i>
                                <span className="text-[12px]">{`Drag and Drop a file`}</span>
                            </div>
                        </div>
                    </div>
                )}
                {isFileSelected && (
                    <canvas ref={canvasRef} className=" min-w-[300px] max-w-[800px] "></canvas>
                )}

            </div>

            <div className="flex w-full fixed bottom-0 p-5 justify-end space-x-2">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => onHandleScanImage()}
                >Scan Image</button>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => onHandleCropImage()}
                >Crop Image</button>
                {isFileSelected && (
                    <button onClick={() => onHandleResetImage()} className="bg-red-500 text-white px-4 py-2 rounded">
                        Reset
                    </button>
                )}
            </div>
        </div>
    )
    // return (
    //     <>
    //         <div className="flex w-full min-h-screen">
    //             <div className="w-3/4 border border-green-700"> test</div>
    //             <div className="w-1/4 border border-red-700"></div>
    //         </div>
    //         <div>DocumentScanner</div>
    //         <div>opencv status - {isOpencvLoaded ? "Loaded" : "Not loaded"}</div>
    //         <div>
    //             <img ref={imageRef} src="/images/sample-001.jpg" alt="Input" />
    //         </div>
    //         <button onClick={(e) => onHandleScanImage()} >Scan Image</button>


    //         <canvas ref={canvasRef}></canvas>

    //         <div className="h-32 w-full overflow-hidden relative shadow-md border-2 items-center rounded-md cursor-pointer   border-gray-400 border-dotted">
    //                     <input type="file" onChange={handleFileChange} className="h-full w-full opacity-0 z-10 absolute" name="files[]" />
    //                     <div className="h-full w-full bg-gray-200 absolute z-1 flex justify-center items-center top-0">
    //                         <div className="flex flex-col">
    //                             <i className="mdi mdi-folder-open text-[30px] text-gray-400 text-center"></i>
    //                             <span className="text-[12px]">{`Drag and Drop a file`}</span>
    //                         </div>
    //                     </div>
    //                 </div>

    //         <input type="file" onChange={handleFileChange} />
    //         <div
    //             style={{
    //                 width: '100%',
    //                 height: '400px',
    //                 border: '2px dashed #cccccc',
    //                 borderRadius: '5px',
    //                 marginTop: '20px',
    //                 display: 'flex',
    //                 alignItems: 'center',
    //                 justifyContent: 'center',
    //             }}
    //             onDragOver={handleDragOver}
    //             onDrop={handleDrop}
    //         >
    //             {imageSrc ? (
    //                 <img ref={imageRef} src={imageSrc} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100%' }} />
    //             ) : (
    //                 <p>Drag and drop an image here, or click to select an image</p>
    //             )}
    //         </div>


    //     </>
    // )
}

interface Point {
    x: number;
    y: number;
}

class documentScanner {
    // initiate cv
    cv: any;

    // variables to handle the cv state & error
    isOpenCVLoaded: boolean = false;
    isError: boolean = false;
    error: string | null = null;
    isImageScanned: boolean = false;

    // image & canvas
    image: HTMLImageElement | null = null;
    canvas: HTMLCanvasElement | null = null;

    // cv variables
    maxContour: any;
    points: any;

    constructor() {
        this.isOpenCVLoaded = false
        this.load()
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
        this.canvas = canvas
        const src = this.cv.imread(canvas);

        const gray = new this.cv.Mat();
        this.cv.cvtColor(src, gray, this.cv.COLOR_RGBA2GRAY);

        const blur = new this.cv.Mat();
        this.cv.GaussianBlur(gray, blur, new this.cv.Size(5, 5), 0, 0, this.cv.BORDER_DEFAULT);

        const thresh = new this.cv.Mat();
        this.cv.threshold(blur, thresh, 0, 255, this.cv.THRESH_BINARY + this.cv.THRESH_OTSU);

        let contours = new this.cv.MatVector();
        let hierarchy = new this.cv.Mat();

        this.cv.findContours(thresh, contours, hierarchy, this.cv.RETR_CCOMP,
            this.cv.CHAIN_APPROX_SIMPLE);

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
        this.points = this.detectCornerPoints(this.maxContour)
        this.isImageScanned = true;

        src.delete();
        // dst.delete();

        return this.points

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
    getDistance(p1: Point, p2: Point) { return Math.hypot(p1.x - p2.x, p1.y - p2.y); }
    drawOutline() {
        console.log("draw outline initiated")
        console.log("canvas - ", this.canvas)
        console.log("points - ", this.points)
        if (this.canvas && this.points) {
            console.log("draw outline started")
            const ctx = this.canvas.getContext('2d');
            if (ctx) {
                // setCornerPoints(this.points);
                this.points.forEach((point: any) => {
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
                    ctx.fill();
                });

                ctx.strokeStyle = 'blue';
                ctx.lineWidth = 2;
                if (this.points.length === 4) {
                    ctx.beginPath();
                    ctx.moveTo(this.points[0].x, this.points[0].y);
                    for (let i = 1; i < this.points.length; i++) {
                        ctx.lineTo(this.points[i].x, this.points[i].y);
                    }
                    ctx.closePath();
                    ctx.stroke();
                }
            }
        }
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
                points[3].x, points[3].y
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
                0, height
            ]);
            const M = this.cv.getPerspectiveTransform(pts1, pts2);
    
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Resize the canvas to the new dimensions
            canvas.width = width;
            canvas.height = height;
    
            this.cv.warpPerspective(src, dst, M, new this.cv.Size(width, height));
            this.cv.imshow(canvas, dst);
            src.delete();
            dst.delete();
            pts1.delete();
            pts2.delete();
            M.delete();
        }
    }
}