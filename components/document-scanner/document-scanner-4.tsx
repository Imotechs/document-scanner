"use client"

import React, { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';

// import library
import { loadOpenCV } from '@/lib/opencv';

// import UI
import { Button } from "@/components/ui/button"

// import icons
import { LuScanLine } from "react-icons/lu";
import { FiCrop } from "react-icons/fi";
import { LiaUndoAltSolid } from "react-icons/lia";
import { CiUndo } from "react-icons/ci";

export const DocumentScanner4 = () => {
    const [isOpencvLoaded, setIsOpencvLoaded] = useState(false);
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [cornerPoints, setCornerPoints] = useState<Point[]>([]);
    // const [circles, setCircles] = useState<{ x: number; y: number; radius: number }[]>([]);
    const [circles, setCircles] = useState<Point[]>([]);

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    // const [scaling, setScaling] = useState({ scaleX: 1, scaleY: 1 });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // doc scanner object
    const docScanner = new documentScanner();


    // useEffect(() => {
    //     if (typeof window !== 'undefined') {
    //         // Ensure the code runs only on the client side
    //         loadOpenCV()
    //             .then(() => {
    //                 setIsOpencvLoaded(true);
    //             })
    //             .catch((err) => {
    //                 console.error('Failed to load OpenCV.js', err);
    //             });
    //     }
    // }, []);    
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
        if (canvas) {
            docScanner.cropImage(canvas, cornerPoints);
        }
    };
    

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
                        // Initialize the canvas
                        canvas.width = 800;
                        canvas.height = 500;
                        // canvas.width = img.width;
                        // canvas.height = img.height;

                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            // ctx.clearRect(0, 0, canvas.width, canvas.height);
                            // canvas.width = img.width;
                            // canvas.height = img.height;
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                            setImageSrc(e.target?.result as string);

                            // // Calculate scaling factors based on image and canvas dimensions
                            // const scaleX = canvas.width / img.width;
                            // const scaleY = canvas.height / img.height;

                            // Store scaling factors for later use
                            // setScaling({ scaleX, scaleY });
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

    const handleDrawCircles = (points: Point[]) => {
        // const { scaleX, scaleY } = scaling;  // Assume scaling is a state storing scaleX and scaleY
        const circlesData = points.map(point => ({ x: point.x, y: point.y, radius: 5 }));
        // const circlesData = points.map(point => ({
        //     x: point.x * scaleX,
        //     y: point.y * scaleY,
        //     radius: 5
        // }));

        // setCircles(circlesData);
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

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow p-6">
                <h1 className="text-3xl font-semibold text-gray-700">Document Scanner</h1>
                <p className="text-sm text-gray-500 mt-1">Scanner status - {isOpencvLoaded ? "Loaded" : "Not loaded"}</p>
            </header>

            <div className="flex flex-col w-full items-center justify-center p-6">
                {
                    !isOpencvLoaded ?
                        <div className="h-64 w-64 max-w-2xl relative border-2 border-neutral-300 shadow rounded-lg my-20">
                            <div className="h-full w-full bg-white absolute z-1 flex justify-center items-center top-0 rounded-lg">
                                <div className="flex flex-col items-center ">

                                    
                                    <span className="text-2xl text-gray-500 ">Loading</span>
                                    
                                </div>
                            </div>
                        </div> : ""

                }
                {!isFileSelected && isOpencvLoaded && (
                    <div className="h-96 w-full max-w-2xl relative border-4 border-gray-300 border-dashed rounded-lg mt-20 ">
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
                            }}
                        />
                        {cornerPoints.map((circle, index) => (
                            <Draggable
                                key={index}
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
            <footer className="flex absolute bottom-0 w-full justify-end bg-white p-6 border-t space-x-4  ">
                <Button 
                    className="space-x-2"
                    onClick={() => onHandleScanImage()}
                >
                    <LuScanLine className="w-6 h-6" />
                    <span>Scan Image</span>                    
                </Button>
                <Button 
                    className="space-x-2"
                    onClick={() => onHandleCropImage()}
                >
                    <FiCrop className="w-6 h-6" />
                    <span>Crop Image</span>                    
                </Button>

                {isFileSelected && (
                    <Button 
                        className="space-x-2"
                        onClick={() => onHandleResetImage()}
                    >
                        <LiaUndoAltSolid className="w-6 h-6" />
                        <span>Reset</span>
                                          
                    </Button>
                )}
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

    // cropImage(canvas: HTMLCanvasElement, points: Point[]) {
    //     const ctx = canvas?.getContext('2d');
    //     if (canvas && ctx && points.length === 4) {
    //         const src = this.cv.imread(canvas);
    //         const dst = new this.cv.Mat();
    //         const pts1 = this.cv.matFromArray(4, 1, this.cv.CV_32FC2, [
    //             points[0].x, points[0].y,
    //             points[1].x, points[1].y,
    //             points[2].x, points[2].y,
    //             points[3].x, points[3].y
    //         ]);
    //         const width = Math.max(
    //             this.getDistance(points[0], points[1]),
    //             this.getDistance(points[2], points[3])
    //         );
    //         const height = Math.max(
    //             this.getDistance(points[0], points[3]),
    //             this.getDistance(points[1], points[2])
    //         );
    //         const pts2 = this.cv.matFromArray(4, 1, this.cv.CV_32FC2, [
    //             0, 0,
    //             width, 0,
    //             width, height,
    //             0, height
    //         ]);
    //         const M = this.cv.getPerspectiveTransform(pts1, pts2);

    //         ctx.clearRect(0, 0, canvas.width, canvas.height);
    //         canvas.width = width;
    //         canvas.height = height;

    //         this.cv.warpPerspective(src, dst, M, new this.cv.Size(width, height));
    //         this.cv.imshow(canvas, dst);
    //         src.delete();
    //         dst.delete();
    //         pts1.delete();
    //         pts2.delete();
    //         M.delete();
    //     }
    // }
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
}
